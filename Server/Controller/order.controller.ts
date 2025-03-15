import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    }[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ user: req.id }).populate("user").populate("restaurant");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const { restaurantId } = checkoutSessionRequest;

        console.log("🔍 Received restaurantId:", restaurantId);

        // Validate restaurantId
        if (!restaurantId || typeof restaurantId !== "string" || !mongoose.Types.ObjectId.isValid(restaurantId)) {
            console.error("❌ Invalid restaurant ID:", restaurantId);
            res.status(400).json({ success: false, message: "Invalid restaurant ID." });
            return;
        }

        const restaurant = await Restaurant.findById(restaurantId).populate('menus');

        if (!restaurant) {
            console.error("❌ Restaurant not found for ID:", restaurantId);
            res.status(404).json({ success: false, message: "Restaurant not found." });
            return;
        }

        console.log("✅ Restaurant found:", restaurant);

        // Proceed with order creation
        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });

        // line items
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: { allowed_countries: ['GB', 'US', 'CA'] },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });

        if (!session.url) {
            console.error("❌ Stripe session URL is missing.");
            res.status(400).json({ success: false, message: "Error while creating session" });
            return;
        }

        console.log("✅ Stripe session created:", session.url);

        await order.save();
        res.status(200).json({ session });

    } catch (error) {
        console.error("❌ Internal server error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const signature = req.headers["stripe-signature"] as string;
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;
        const header = stripe.webhooks.generateTestHeaderString({ payload: payloadString, secret });

        const event = stripe.webhooks.constructEvent(payloadString, header, secret);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            await order.save();
        }

        res.status(200).send();
    } catch (error: any) {
        console.error("Webhook error:", error.message);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    return checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        };
    });
};