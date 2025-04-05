import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MenuFormSchema, menuSchema } from "../Schema/menuSchema";
import { useMenuStore } from "../store/useMenuStore";
import { MenuItem } from "../types/restaurantType";
import { Loader2 } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const dialogContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const buttonHoverVariants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.98 }
};

const EditMenu = ({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: MenuItem;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, editMenu } = useMenuStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await editMenu(selectedMenu._id, formData);
      setEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedMenu && editOpen) {
      setInput({
        name: selectedMenu.name || "",
        description: selectedMenu.description || "",
        price: selectedMenu.price || 0,
        image: undefined,
      });
    }
  }, [selectedMenu, editOpen]);

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <AnimatePresence>
        {editOpen && (
          <DialogContent forceMount className="overflow-hidden">
            <motion.div
              variants={dialogContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <DialogTitle>Edit Menu</DialogTitle>
                  <DialogDescription>
                    Update your menu to keep your offerings fresh and exciting!
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <form onSubmit={submitHandler} className="space-y-4">
                {/* Form fields with pre-populated values */}
                <motion.div
                  custom={0}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="Enter menu name"
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.name}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  custom={1}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Label>Description</Label>
                  <Input
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Enter menu description"
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.description}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  custom={2}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Label>Price in (Rupees)</Label>
                  <Input
                    type="number"
                    name="price"
                    value={input.price}
                    onChange={changeEventHandler}
                    placeholder="Enter menu price"
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.price}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  custom={3}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Label>Upload Menu Image</Label>
                  <Input
                    type="file"
                    name="image"
                    onChange={(e) =>
                      setInput({ ...input, image: e.target.files?.[0] || undefined })
                    }
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.image?.name}
                    </span>
                  )}
                </motion.div>

                <DialogFooter className="mt-5">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={buttonHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button className="bg-orange hover:bg-hoverOrange">
                        Submit
                      </Button>
                    </motion.div>
                  )}
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default EditMenu;