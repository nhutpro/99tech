import e, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "../utils/logger";

export function extractJwtMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("JWT extraction middleware triggered");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("No token provided");
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret) as { userId?: number, role?: string };
        if (!payload || !payload.role) {
            logger.warn("Invalid token payload");
            return res.status(401).json({ error: "Invalid token" });
        }
        logger.info("Token successfully verified", { userId: payload.userId, role: payload.role });
        (req as any).user = payload;
        next();
    } catch (err: any) {
        logger.error("Token verification failed", { error: err.message });
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}


export function userMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("User middleware triggered");
    const user = (req as any).user;

    if (!user) {
        logger.warn("Unauthorized access attempt by user", { userId: user?.userId });
        return res.status(403).json({ error: "Access denied" });
    }

    if (req.params.id && parseInt(req.params.id) !== user.userId && user.role !== "admin") {
        logger.warn("User does not have permission to access this resource", { userId: user.userId });
        return res.status(403).json({ error: "Access denied" });
    }

    logger.info("User is authorized", { userId: user.userId });
    next();
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info("Admin middleware triggered");
    const user = (req as any).user;

    if (!user || user.role !== "admin") {
        logger.warn("Unauthorized access attempt by user", { userId: user?.userId });
        return res.status(403).json({ error: "Access denied" });
    }

    logger.info("User is authorized as admin", { userId: user.userId });
    next();
}