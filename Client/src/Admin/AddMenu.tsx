import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Plus } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "../Schema/menuSchema";
import { useMenuStore } from "../store/useMenuStore";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { useUserStore } from "../store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // ✅ Toast import

// Animation variants
const menuItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    scale: 1.02,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const dialogContentVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
};

const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [error, setError] = useState<Partial<MenuFormSchema>>({});

  const { loading, createMenu } = useMenuStore();
  const { restaurant } = useRestaurantStore();
  const { user } = useUserStore();

  // ✅ Block non-admins from accessing AddMenu page entirely
  if (!user?.admin) {
    return (
      <div className="text-center mt-20 text-lg font-semibold text-red-600">
        🚫 You are not authorized to view this page.
      </div>
    );
  }

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  useEffect(() => {
    return () => {
      useMenuStore.setState({ loading: false });
    };
  }, []);

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
      formData.append("restaurantId", restaurant?._id.toString() || "");

      await createMenu(formData);

      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
      });
      setOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto my-10"
    >
      <div className="flex justify-between">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-bold md:font-extrabold text-lg md:text-2xl"
        >
          Available Menus
        </motion.h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <motion.div
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button className="bg-orange hover:bg-hoverOrange">
                <Plus className="mr-2" />
                Add Menus
              </Button>
            </motion.div>
          </DialogTrigger>

          <AnimatePresence>
            {open && (
              <DialogContent forceMount>
                <motion.div
                  variants={dialogContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <DialogHeader>
                    <DialogTitle>Add A New Menu</DialogTitle>
                    <DialogDescription>
                      Create a menu that will make your restaurant stand out.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={submitHandler} className="space-y-4">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={changeEventHandler}
                      placeholder="Enter menu name"
                    />
                    {error.name && (
                      <span className="text-xs font-medium text-red-600">
                        {error.name}
                      </span>
                    )}

                    <Label>Description</Label>
                    <Input
                      type="text"
                      name="description"
                      value={input.description}
                      onChange={changeEventHandler}
                      placeholder="Enter menu description"
                    />
                    {error.description && (
                      <span className="text-xs font-medium text-red-600">
                        {error.description}
                      </span>
                    )}

                    <Label>Price in (Rupees)</Label>
                    <Input
                      type="number"
                      name="price"
                      value={input.price}
                      onChange={changeEventHandler}
                      placeholder="Enter menu price"
                    />
                    {error.price && (
                      <span className="text-xs font-medium text-red-600">
                        {error.price}
                      </span>
                    )}

                    <Label>Upload Menu Image</Label>
                    <Input
                      type="file"
                      name="image"
                      onChange={(e) =>
                        setInput({
                          ...input,
                          image: e.target.files?.[0] || undefined,
                        })
                      }
                    />
                    {error.image?.name && (
                      <span className="text-xs font-medium text-red-600">
                        {error.image.name}
                      </span>
                    )}

                    <DialogFooter className="mt-5">
                      {loading ? (
                        <Button disabled className="bg-orange hover:bg-hoverOrange">
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Please wait
                        </Button>
                      ) : (
                        <Button className="bg-orange hover:bg-hoverOrange">
                          Submit
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </div>

      <div className="grid gap-4 mt-6">
        {restaurant?.menus?.map((menu: any, idx: number) => (
          <motion.div
            key={menu._id || idx}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={menuItemVariants}
            whileHover="hover"
            className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border bg-white"
          >
            <motion.img
              src={menu.image}
              alt={menu.name}
              className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {menu.name}
              </h1>
              <p className="text-sm tex-gray-600 mt-1">{menu.description}</p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#D19254]">{menu.price}</span>
              </h2>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  if (!user?.admin) {
                    toast.error("Only admins can edit the menu.");
                    return;
                  }
                  setSelectedMenu(menu);
                  setEditOpen(true);
                }}
                size={"sm"}
                className="bg-orange hover:bg-hoverOrange mt-2"
              >
                Edit
              </Button>
            </motion.div>
          </motion.div>
        )) ?? null}
      </div>

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </motion.div>
  );
};

export default AddMenu;
