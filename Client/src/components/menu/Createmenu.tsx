import React, { useState, FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { menuSchema, MenuFormSchema } from "../../Schema/menuSchema";
import { useMenuStore } from "../../store/useMenuStore";

interface CreateMenuProps {
  restaurantId: string;
  onMenuCreated: () => void;
}

const CreateMenu: React.FC<CreateMenuProps> = ({ restaurantId, onMenuCreated }) => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { createMenu, loading } = useMenuStore();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setInput({
      ...input,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, image: file });
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    const result = menuSchema.safeParse(input);
    if (!result.success) {
      setError(result.error.formErrors.fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) formData.append("image", input.image);
      formData.append("restaurantId", restaurantId);

      await createMenu(formData);
      toast.success("Menu created successfully!");
      onMenuCreated();

      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
      });
    } catch (error) {
      console.error("Create Menu Error:", error);
    }
  };

  return (
    <motion.form
      onSubmit={submitHandler}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow bg-white"
    >
      <h2 className="text-xl font-bold text-center text-gray-800">Create New Menu</h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="Enter menu name"
          value={input.name}
          onChange={changeHandler}
        />
        {error.name && <p className="text-xs text-red-600 mt-1">{error.name}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label>Description</Label>
        <Input
          type="text"
          name="description"
          placeholder="Enter menu description"
          value={input.description}
          onChange={changeHandler}
        />
        {error.description && <p className="text-xs text-red-600 mt-1">{error.description}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          placeholder="Enter price in rupees"
          value={input.price}
          onChange={changeHandler}
        />
        {error.price && <p className="text-xs text-red-600 mt-1">{error.price}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label>Upload Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {error.image?.name && <p className="text-xs text-red-600 mt-1">{error.image.name}</p>}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-2"
      >
        <motion.div
          whileHover={{
            scale: [1, 1.05, 1],
            x: [0, -3, 3, 0],
            transition: { duration: 0.4 },
          }}
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange hover:bg-hoverOrange"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...
              </>
            ) : (
              "Create Menu"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );

};

export default CreateMenu;
