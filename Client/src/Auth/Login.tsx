import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import { Input } from "../components/ui/input";
import { LoginInputState, userLoginSchema } from "../Schema/userSchema";
import { useUserStore } from "../store/useUserStore";

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const { loading, login } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null); // Clear previous server errors
    setErrors({}); // Reset validation errors

    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      setErrors(result.error.formErrors.fieldErrors as Partial<LoginInputState>);
      return;
    }

    try {
      await login(input);
      navigate("/");
    } catch (error) {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4 text-center">
          <h1 className="font-bold text-2xl">𝕋𝕒𝕤𝕥𝕖 & 𝕋𝕨𝕚𝕤𝕥</h1>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
          {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
          {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
        </div>

        {/* Display Server Error */}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        {/* Login Button with Framer Motion Animation */}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="hover:text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Separator />

        {/* Signup Link */}
        <p className="mt-2 text-center">
          Don't have an account?{" "}
          <Link to="/Signup" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
