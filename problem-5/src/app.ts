import express from "express";
import cors from "cors";
import router from "./routes";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});


export default app;