import { Request, Response } from "express";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price } = req.body;
        const file = req.file;

        // Validate required fields
        if (!name || !description || !price || !file) {
            res.status(400).json({
                success: false,
                message: "All fields are required including image"
            });
            return;
        }

        // Find the restaurant associated with the logged-in user
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }

        const imageUrl = await uploadImageOnCloudinary(file);
        const menu:any = await Menu.create({
            name,
            description,
            price: Number(price),
            image: imageUrl,
            restaurantId: restaurant._id // Add restaurant reference
        });

        // Add menu to restaurant's menus array
        restaurant.menus.push(menu._id);
        await restaurant.save();

        res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};
export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const file = req.file;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid menu ID"
            });
            return;
        }

        const menu = await Menu.findById(id);

        if (!menu) {
            res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
            return;
        }

        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = price;

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }

        await menu.save();

        res.status(200).json({
            success: true,
            message: "Menu updated",
            menu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
