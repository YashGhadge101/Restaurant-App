import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { SignupInputState, LoginInputState } from "src/Schema/userSchema";

const API_END_POINT = "http://localhost:8000/api/v1/user";
axios.defaults.withCredentials = true;

type User = {
    fullname: string;
    email: string;
    contact: number;
    address: string;
    city: string;
    country: string;
    profilePicture: string;
    admin: boolean;
    isVerified: boolean;
};

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input: SignupInputState) => Promise<void>;
    login: (input: LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateProfile: (input: Partial<User>) => Promise<void>;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            loading: false,

            // ✅ Signup API
            signup: async (input: SignupInputState) => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/signup`, input, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (data.success) {
                        toast.success(data.message);
                        set({ user: data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Signup failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Login API
            login: async (input: LoginInputState) => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/login`, input, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (data.success) {
                        toast.success(data.message);
                        set({ user: data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Login failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Verify Email API
            verifyEmail: async (verificationCode: string) => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (data.success) {
                        toast.success(data.message);
                        set({ user: data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Email verification failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Check Authentication API
            checkAuthentication: async () => {
                try {
                    set({ isCheckingAuth: true });
                    const { data } = await axios.get(`${API_END_POINT}/check-auth`);
                    if (data.success) {
                        set({ user: data.user, isAuthenticated: true });
                    }
                } catch {
                    set({ isAuthenticated: false });
                } finally {
                    set({ isCheckingAuth: false });
                }
            },

            // ✅ Logout API
            logout: async () => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/logout`);
                    if (data.success) {
                        toast.success(data.message);
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Logout failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Forgot Password API
            forgotPassword: async (email: string) => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/forgot-password`, { email });
                    if (data.success) {
                        toast.success(data.message);
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Password reset request failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Reset Password API
            resetPassword: async (token: string, newPassword: string) => {
                try {
                    set({ loading: true });
                    const { data } = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
                    if (data.success) {
                        toast.success(data.message);
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Password reset failed.");
                } finally {
                    set({ loading: false });
                }
            },

            // ✅ Update Profile API
            updateProfile: async (input: Partial<User>) => {
                try {
                    const { data } = await axios.put(`${API_END_POINT}/profile/update`, input, {
                        headers: { "Content-Type": "application/json" },
                    });

                    if (data.success) {
                        toast.success(data.message);
                        set({ user: data.user });
                    }
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Profile update failed.");
                }
            },
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
