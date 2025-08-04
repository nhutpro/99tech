import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { StringValue } from "ms";
import prisma from "../config/prisma";

class AuthService {

    async generateAccessToken(userId: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            config.jwtSecret,
            { expiresIn: config.accessTokenExpiresIn as StringValue }
        );

        return {
            accessToken
        };
    }
}

export default new AuthService();
