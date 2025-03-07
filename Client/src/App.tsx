import Login from "./Auth/Login"
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ForgotPassword from './Auth/ForgotPassword.tsx'
import ResetPassword from "./Auth/ResetPassword.tsx"
import VerifyEmail from "./Auth/VerifyEmail.tsx"
import HereSection from "./components/HereSection.tsx"
import MainLayout from "./layout/Mainlayout.tsx"
import Profile from "./components/Profile.tsx"
import SearchPage from "./components/SearchPage.tsx"
import RestaurantDetail from "./components/RestaurantDetail.tsx"
import Cart from "./components/Cart.tsx"
import Restaurant from "./Admin/Restaurant.tsx"
import AddMenu from "./Admin/AddMenu.tsx"
import Orders from "./Admin/Orders.tsx"
import Success from "./components/Success.tsx"
import { useUserStore } from "./store/useUserStore.ts"
import { useEffect } from "react"
import Loading from "./components/Loading.tsx"
import Signup from "./Auth/Signup.tsx"
import { useThemeStore } from "./store/useThemeStore.ts"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useUserStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useUserStore();
    if (isAuthenticated && user?.isVerified) {
        return <Navigate to="/" replace />
    }
    return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useUserStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    if (!user?.admin) {
        return <Navigate to="/" replace />
    }

    return children;
}

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoutes>
            <MainLayout />
        </ProtectedRoutes>,
        children: [
            {
                path: "/",
                element: <HereSection />
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/search/:text",
                element: <SearchPage />,
            },
            {
                path: "/restaurant/:id",
                element: <RestaurantDetail />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/order/status",
                element: <Success />,
            },
            // Admin services start from here
            {
                path: "/admin/restaurant",
                element: <AdminRoute><Restaurant /></AdminRoute>,
            },
            {
                path: "/admin/menu",
                element: <AdminRoute><AddMenu /></AdminRoute>,
            },
            {
                path: "/admin/orders",
                element: <AdminRoute><Orders /></AdminRoute>,
            },
        ]
    },
    {
        path: "/login",
        element: <AuthenticatedUser><Login /></AuthenticatedUser>
    },
    {
        path: "/signup",
        element: <AuthenticatedUser><Signup /></AuthenticatedUser>
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />,
    },

])

function App() {
    const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
    const {checkAuthentication, isCheckingAuth} = useUserStore();
    // checking auth every time when page is loaded
    useEffect(()=>{
      checkAuthentication();
      initializeTheme();
    },[checkAuthentication])
  
    if(isCheckingAuth) return <Loading/>
    return (
      <main>
        <RouterProvider router={appRouter}></RouterProvider>
      </main>
    );
  }
  
  export default App;