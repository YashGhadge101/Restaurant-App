import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { SignupInputState, userSignupSchema } from "../Schema/userSchema";
import { useUserStore } from "../store/useUserStore";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form 
        onSubmit={signupSubmitHandler} 
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4 text-center">
          <h1 className="font-bold text-2xl">𝕋𝕒𝕤𝕥𝕖 & 𝕋𝕨𝕚𝕤𝕥</h1>
        </div>

        {/* Full Name Input */}
        <div className="mb-4 relative">
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
        </div>

        {/* Email Input */}
        <div className="mb-4 relative">
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
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
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
        </div>

        {/* Contact Input */}
        <div className="mb-4 relative">
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
        </div>

        {/* Display Server Error */}
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

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

        <p className="mt-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
