import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useUserStore } from "../store/useUserStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { loading, verifyEmail } = useUserStore();

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");

    if (verificationCode.length < 6) {
      alert("Please enter all 6 digits.");
      return;
    }

    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
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
      className="flex items-center justify-center h-screen w-full"
    >
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email address
          </p>
        </motion.div>
        <form onSubmit={submitHandler}>
          <div className="flex justify-between">
            {otp.map((digit, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <Input
                  ref={(el) => (inputRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </motion.div>
            ))}
          </div>
          <Button
            disabled={loading}
            className="bg-orange hover:bg-hoverOrange mt-6 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;