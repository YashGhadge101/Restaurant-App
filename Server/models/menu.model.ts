import mongoose, { Document } from "mongoose";

export interface IMenu {
    name: string;
    description: string;
    price: number;
    image: string;
    restaurantId: mongoose.Schema.Types.ObjectId; // Link to Restaurant
}

export interface IMenuDocument extends IMenu, Document {
    createdAt: Date;
    updatedAt: Date;
}

const menuSchema = new mongoose.Schema<IMenuDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // Reference to Restaurant
      required: true,
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.model<IMenuDocument>("Menu", menuSchema);
