import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id?: string;
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
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

        if (!decode || !decode.userId) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ success: false, message: "Authentication failed" });
    }
};

