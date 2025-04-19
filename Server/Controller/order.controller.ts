import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckoutSessionRequest = {
  restaurantId: string;
  deliveryDetails: {
    name: string;
    email?: string;
    contact?: string;
    address: string;
    city?: string;
    country?: string;
  };
  cartItems: {
    menuId: string;
    name?: string;
    image?: string;
    price?: string;
    quantity: string;
  }[];
};

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any[]) => {
  return checkoutSessionRequest.cartItems.map((item) => {
    const menu = menuItems.find((m: any) => m._id.toString() === item.menuId);
    const productData: any = {
      name: menu?.name || "Item",
    };

    if (menu?.image) {
      productData.images = [menu.image];
    }

    return {
      price_data: {
        currency: "usd",
        product_data: productData,
        unit_amount: menu?.price ? Math.round(Number(menu.price) * 100) : 0,
      },
      quantity: Number(item.quantity),
    };
  });
};

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus");
    if (!restaurant) {
      res.status(404).json({ success: false, message: "Restaurant not found." });
      return;
    }

    const menuItems = restaurant.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const totalAmount = lineItems.reduce((acc, item) => {
      return acc + (item.price_data.unit_amount || 0) * item.quantity;
    }, 0);

    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      totalAmount,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(
          menuItems
            .slice(0, 3)
            .map((item: any) => item.image?.slice(0, 50))
        ),
      },
    });

    if (!session.url) {
      res.status(400).json({ success: false, message: "Error while creating session" });
      return;
    }

    await order.save();
    res.status(200).json({ session });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });

    if (!restaurant) {
      res.status(404).json({ success: false, message: "Restaurant not found" });
      return;
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching restaurant orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.id })
      .populate("restaurant")
      .populate("user");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
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

    const lowerStatus = status.toLowerCase();
    
    if (!validStatuses.includes(lowerStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: lowerStatus },
      { new: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"]!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { status: "paid" });
      console.log("✅ Order marked as paid:", orderId);
    }
  }

  res.status(200).send("Webhook received.");
};
