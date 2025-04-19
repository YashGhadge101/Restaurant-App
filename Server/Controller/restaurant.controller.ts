import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Order } from "../models/order.model";
import { Menu } from "../models/menu.model";
import mongoose from "mongoose";

export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    // Removed the duplicate restaurant check here!

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image is required",
      });
      return;
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    const createdRestaurant = await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant Added",
      restaurant: createdRestaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({ user: req.id }).populate("menus");
    if (!restaurants || restaurants.length === 0) {
      res.status(404).json({
        success: false,
        restaurants: [],
        message: "Restaurants not found",
      });
      return;
    }
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
      console.log("Request Params:", req.params);
      console.log("Request Body:", req.body);
      const {
          restaurantName,
          city,
          country,
          deliveryTime,
          cuisines,
          restaurantId,
      } = req.body;
      const file = req.file;

      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
          res.status(404).json({
              success: false,
              message: "Restaurant not found",
          });
          return;
      }

      restaurant.restaurantName = restaurantName;
      restaurant.city = city;
      restaurant.country = country;
      restaurant.deliveryTime = deliveryTime;
      restaurant.cuisines = JSON.parse(cuisines);

      if (file) {
          const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
          restaurant.imageUrl = imageUrl;
      }

      await restaurant.save();

      res.status(200).json({
          success: true,
          message: "Restaurant updated",
          restaurant,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantMenus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
      const { restaurantId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
          res.status(400).json({ 
              success: false, 
              message: "Invalid restaurant ID format." 
          });
          return;
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
          res.status(404).json({ 
              success: false, 
              message: "Restaurant not found." 
          });
          return;
      }

      const menus = await Menu.find({ restaurantId })
          .sort({ createdAt: -1 });

      res.status(200).json({ 
          success: true, 
          menus 
      });
  } catch (error) {
      console.error("Error fetching menus:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
      });
  }
};

export const getRestaurantOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Fetching orders for user:", req.id);

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      console.log("No restaurant found for user:", req.id);
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    console.log("Found restaurant:", restaurant._id);

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    console.log("Fetched orders:", orders.length);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getRestaurantOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "outfordelivery",
      "delivered",
    ];

    if (!validStatuses.includes(status.toLowerCase())) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    order.status = status.toLowerCase();
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const searchRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string || "")
      .split(",")
      .filter((cuisine) => cuisine);
    const query: any = {};
    console.log(selectedCuisines);

    if (searchText) {
      query.$or = [
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } },
      ];
    }
    if (searchQuery) {
      query.$or = [
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } },
      ];
    }
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query);
    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      model: "Menu", // Explicitly specify the Menu model
      options: { createdAt: -1 },
    });
    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};