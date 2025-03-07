import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id?: string; // ✅ Ensures req.id exists
        }
    }
}
export interface AuthenticatedRequest extends Request {
    id?: string;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            console.log("❌ No token found in cookies");
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

        if (!decode || !decode.userId) {
            console.log("❌ Invalid token payload:", decode);
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(401).json({ success: false, message: "Authentication failed" });
    }
};
