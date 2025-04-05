import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "../store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  fullname: string;
  email: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
}

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture);

  useEffect(() => {
    setProfileData({
      fullname: user?.fullname || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      profilePicture: user?.profilePicture || "",
    });
    setSelectedProfilePicture(user?.profilePicture || "");
  }, [user]);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({ ...prevData, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={updateProfileHandler}
      className="max-w-7xl mx-auto my-5"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <motion.div className="flex items-center gap-2">
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="md:w-28 md:h-28 w-20 h-20 transition-all duration-300">
              <AvatarImage src={selectedProfilePicture} alt="Profile picture" />
              <AvatarFallback>CN</AvatarFallback>
              <input ref={imageRef} className="hidden" type="file" accept="image/*" onChange={fileChangeHandler} />
              <motion.div
                onClick={() => imageRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              >
                <Plus className="text-white w-8 h-8" />
              </motion.div>
            </Avatar>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={changeHandler}
              className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent transition-all duration-300 hover:bg-gray-100"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid md:grid-cols-4 md:gap-2 gap-3 my-10"
      >
        <AnimatePresence>
          {[
            { icon: Mail, label: "Email", name: "email", disabled: true },
            { icon: LocateIcon, label: "Address", name: "address" },
            { icon: MapPin, label: "City", name: "city" },
            { icon: MapPinnedIcon, label: "Country", name: "country" },
          ].map(({ icon: Icon, label, name, disabled }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 transition-all duration-300 transform"
              whileHover={{ zIndex: 1, scale: 1.05 }} // Bring forward and scale on hover
              whileTap={{ scale: 0.95 }} // Scale on tap
            >
              <Icon className="text-gray-500" />
              <div className="w-full">
                <Label>{label}</Label>
                <input
                  name={name}
                  value={profileData[name as keyof ProfileData]}
                  onChange={changeHandler}
                  disabled={disabled}
                  className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none transition-all duration-300 hover:bg-gray-100"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-orange hover:bg-hoverOrange transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};

export default Profile;