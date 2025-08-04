import { Request, Response } from "express";
import authService from "../services/auth-service";
import logger from "../utils/logger";

class AuthenticationController {
  async authController(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const result = await authService.generateAccessToken(parseInt(userId));
      if (!result) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      logger.info("Authentication successful", { userId });
      res.json(result);

    } catch (error) {
      console.log({ error });
      logger.error("Error occurred during authentication: ", error);
      res.status(500).json({ error: "Internal server error" });
    }

  }

}

export default new AuthenticationController();
