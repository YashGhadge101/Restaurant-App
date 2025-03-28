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
    isCheckingAuth: boolean;  // Fixed: Added this property
    loading: boolean;
    signup: (input: SignupInputState) => Promise<void>;
    login: (input: LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateProfile: (input: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isCheckingAuth: false, // Fixed: Initialize isCheckingAuth
            loading: false,

            // Signup API implementation
            signup: async (input: SignupInputState) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/signup`, input, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false, user: response.data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message);
                }
            },

            login: async (input: LoginInputState) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/login`, input, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false, user: response.data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },

            verifyEmail: async (verificationCode: string) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                        headers: { "Content-Type": "application/json" },
                    });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false, user: response.data.user, isAuthenticated: true });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },

            checkAuthentication: async () => {
                try {
                    set({ isCheckingAuth: true });
                    const response = await axios.get(`${API_END_POINT}/check-auth`);
                    if (response.data.success) {
                        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
                    }
                } catch (error) {
                    set({ isAuthenticated: false, isCheckingAuth: false });
                }
            },

            logout: async () => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/logout`);
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false, user: null, isAuthenticated: false });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },

            forgotPassword: async (email: string) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },

            resetPassword: async (token: string, newPassword: string) => {
                try {
                    set({ loading: true });
                    const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
                    if (response.data.success) {
                        toast.success(response.data.message);
                        set({ loading: false });
                    }
                } catch (error: any) {
                    set({ loading: false });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },

            updateProfile: async (input:any) => {
                try { 
                    const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
                        headers:{
                            'Content-Type':'application/json'
                        }
                    });
                    console.log("Profile Data Sent:", input);

                    if(response.data.success){
                        toast.success(response.data.message);
                        set({user:response.data.user, isAuthenticated:true});
                    }
                } catch (error:any) { 
                    console.error("Error Response:", error.response?.data || error.message);
                    toast.error(error.response.data.message || "Internal Server Error");
                }
            }
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
