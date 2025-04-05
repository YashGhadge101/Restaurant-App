import { Request, Response } from "express";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

interface AddMenuRequest {
  name: string;
  description: string;
  price: string;
}

interface EditMenuRequest {
  name?: string;
  description?: string;
  price?: string;
}

export const addMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price }: AddMenuRequest = req.body;
    const file = req.file;

    if (!name || !description || !price || !file) {
      res.status(400).json({
        success: false,
        message: "Name, description, price, and image are required.",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found for the logged-in user.",
      });
      return;
    }

    const imageUrl = await uploadImageOnCloudinary(file);

    const menu:any = await Menu.create({
      name,
      description,
      price: Number(price),
      image: imageUrl,
      restaurantId: restaurant._id,
    });

    restaurant.menus.push(menu._id);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Menu added successfully.",
      menu,
    });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add menu. Please try again later.",
    });
  }
};

export const editMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price }: EditMenuRequest = req.body;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid menu ID format:", id); // Logging
      res.status(400).json({
        success: false,
        message: "Invalid menu ID format.",
      });
      return;
    }

    const menu = await Menu.findById(id);

    if (!menu) {
      console.error("Menu not found:", id); // Logging
      res.status(404).json({
        success: false,
        message: "Menu not found with the provided ID.",
      });
      return;
    }

    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = Number(price); // Explicitly convert to number

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
      menu.image = imageUrl;
    }

    await menu.save();

    res.status(200).json({
      success: true,
      message: "Menu updated successfully.",
      menu,
    });
  } catch (error) {
    console.error("Error editing menu:", error); // Logging
    res.status(500).json({
      success: false,
      message: "Failed to update menu. Please try again later.",
    });
  }
};

export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, restaurantId } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, message: "Image is required" });
            return;
        }

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        const createdMenu = await Menu.create({
            name,
            description,
            price,
            image: imageUrl,
            restaurantId, // make sure restaurantId is saved here.
        });

        res.status(201).json({ success: true, message: "Menu created", menu: createdMenu });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
