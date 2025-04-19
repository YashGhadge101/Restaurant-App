import { Separator } from "@radix-ui/react-separator";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    setServerError(null);
    setErrors({});

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <div className="w-full max-w-md">
        <motion.form
          onSubmit={loginSubmitHandler}
          className="md:p-8 w-full rounded-lg md:border border-gray-200"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-center"
          >
            <h1 className="font-bold text-2xl">𝕋𝕒𝕤𝕥𝕖 & 𝕋𝕨𝕚𝕤𝕥</h1>
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
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
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
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
          </motion.div>

          {/* Server Error */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600"
            >
              {serverError}
            </motion.p>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 12px rgba(255, 115, 0, 0.6)",
            }}
            whileTap={{ scale: 0.9 }}
            className="w-full bg-orange hover:bg-hoverOrange transition-all duration-300 ease-in-out rounded-lg p-2 flex justify-center items-center text-white font-semibold"
          >
            {loading ? (
              <motion.span
                className="flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </motion.span>
            ) : (
              "Login"
            )}
          </motion.button>

          {/* Forgot Password Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            <Link to="/forgot-password" className="hover:text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </motion.div>
        </motion.form>

        {/* Separator and Signup */}
        <Separator className="my-4" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          Don't have an account?{" "}
          <Link to="/Signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Login;
