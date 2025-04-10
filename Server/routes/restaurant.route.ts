import express from "express";
import {
    createRestaurant,
    getRestaurant,
    getRestaurantOrder,
    getSingleRestaurant,
    searchRestaurant,
    updateOrderStatus,
    updateRestaurant,
    getRestaurantMenus,
} from "../Controller/restaurant.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/:restaurantId").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/restaurant/order").get(isAuthenticated, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
router.route("/:id").get(isAuthenticated, getSingleRestaurant);
router.route("/:restaurantId/menus").get(isAuthenticated, getRestaurantMenus);

export default router;