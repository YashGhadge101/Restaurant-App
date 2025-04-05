import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { SignupInputState, userSignupSchema } from "../Schema/userSchema";
import { useUserStore } from "../store/useUserStore";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    email: "",
    password: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Partial<SignupInputState>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { signup, loading } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Ensure contact contains only numbers
    if (name === "contact" && !/^\d*$/.test(value)) return;

    setInput({ ...input, [name]: value });
  };

  const signupSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null); // Reset error on each submission

    // Form validation
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }

    // Signup API implementation
    try {
      await signup(input);
      navigate("/verify-email");
    } catch (error) {
      setServerError("Signup failed. Please try again.");
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1, // Staggered delay based on index
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen"
    >
      <motion.form
        onSubmit={signupSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 text-center"
        >
          <h1 className="font-bold text-2xl">𝕋𝕒𝕤𝕥𝕖 & 𝕋𝕨𝕚𝕤𝕥</h1>
        </motion.div>

        {/* Full Name Input */}
        <motion.div
          custom={0}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 relative"
        >
          <Input
            type="text"
            placeholder="Full Name"
            name="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-1"
            disabled={loading}
          />
          <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors.fullname && <span className="text-xs text-red-500">{errors.fullname}</span>}
        </motion.div>

        {/* Email Input */}
        <motion.div
          custom={1}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 relative"
        >
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-1"
            disabled={loading}
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        </motion.div>

        {/* Password Input */}
        <motion.div
          custom={2}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 relative"
        >
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-1"
            disabled={loading}
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
        </motion.div>

        {/* Contact Input */}
        <motion.div
          custom={3}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 relative"
        >
          <Input
            type="text"
            placeholder="Contact"
            name="contact"
            value={input.contact}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-1"
            disabled={loading}
          />
          <PhoneOutgoing className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors.contact && <span className="text-xs text-red-500">{errors.contact}</span>}
        </motion.div>

        {/* Display Server Error */}
        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-red-500"
          >
            {serverError}
          </motion.p>
        )}

        {/* Signup Button with Framer Motion Animation */}
        <div className="mb-10">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-orange hover:bg-hoverOrange transition-all duration-300 ease-in-out rounded-lg p-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Signup"
            )}
          </motion.button>
        </div>

        <Separator />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-center"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
};

export default Signup;