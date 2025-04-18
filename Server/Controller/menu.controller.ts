import { Request, Response } from "express";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

// Interfaces for request bodies
interface CreateMenuRequest {
    name: string;
    description: string;
    price: string;
    restaurantId?: string;
}

interface EditMenuRequest {
    name?: string;
    description?: string;
    price?: string;
}

interface AddMenuRequest {
    name: string;
    description: string;
    price: string;
    restaurantId?: string;
}

// ✅ ADD MENU (ADMIN OR USER)
export const addMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, restaurantId }: AddMenuRequest = req.body;
        const file = req.file;

        if (!name || !description || !price || !file) {
            res.status(400).json({
                success: false,
                message: "Name, description, price, image, and restaurantId are required.",
            });
            return;
        }

        // Check if restaurant exists based on provided or logged-in user
        const finalRestaurant = restaurantId
            ? await Restaurant.findById(restaurantId)
            : await Restaurant.findOne({ user: req.id });

        if (!finalRestaurant) {
            res.status(404).json({ success: false, message: "Restaurant not found." });
            return;
        }

        const imageUrl = await uploadImageOnCloudinary(file);
        const createdMenu:any = await Menu.create({
            name,
            description,
            price: Number(price),
            image: imageUrl,
            restaurantId: finalRestaurant._id,
        });

        finalRestaurant.menus.push(createdMenu._id);
        await finalRestaurant.save();

        res.status(201).json({
            success: true,
            message: "Menu added successfully.",
            menu: createdMenu,
        });
    } catch (error) {
        console.error("Error adding menu:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add menu. Please try again later.",
        });
    }
};

// ✅ CREATE MENU (EXPLICIT RESTAURANT SELECTION)
export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, restaurantId }: CreateMenuRequest = req.body;
        const file = req.file;

        // Check if the image is provided
        if (!file) {
            res.status(400).json({ success: false, message: "Image is required" });
            return;
        }

        // Determine the restaurant ID (either from the request or logged-in user)
        let finalRestaurantId = restaurantId || await getRestaurantIdFromUser(req);

        if (!finalRestaurantId) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found for the logged-in user.",
            });
            return;
        }

        // Check if the restaurant exists
        const restaurantExists = await Restaurant.findById(finalRestaurantId);
        if (!restaurantExists) {
            res.status(404).json({ success: false, message: "Restaurant not found." });
            return;
        }

        // Upload the image to Cloudinary
        const imageUrl = await uploadImageOnCloudinary(file);

        // Create the menu item
        const createdMenu:any = await Menu.create({
            name,
            description,
            price: Number(price),
            image: imageUrl,
            restaurantId: finalRestaurantId,
        });

        // Add the new menu item to the restaurant's menus array
        restaurantExists.menus.push(createdMenu._id);
        await restaurantExists.save();

        res.status(201).json({ success: true, message: "Menu created successfully", menu: createdMenu });
    } catch (error) {
        console.error("Error creating menu:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ✅ EDIT MENU
export const editMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price }: EditMenuRequest = req.body;
        const file = req.file;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid menu ID format:", id);
            res.status(400).json({ success: false, message: "Invalid menu ID format." });
            return;
        }

        const menu:any = await Menu.findById(id);
        if (!menu) {
            console.error("Menu not found:", id);
            res.status(404).json({ success: false, message: "Menu not found with the provided ID." });
            return;
        }

        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = Number(price);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }

        await menu.save();

        res.status(200).json({ success: true, message: "Menu updated successfully.", menu });
    } catch (error) {
        console.error("Error editing menu:", error);
        res.status(500).json({ success: false, message: "Failed to update menu. Please try again later." });
    }
};

// Helper function to fetch the restaurant ID for the logged-in user
const getRestaurantIdFromUser = async (req: Request): Promise<string | null> => {
    const restaurant:any = await Restaurant.findOne({ user: req.id });
    return restaurant ? restaurant._id.toString() : null;
};
