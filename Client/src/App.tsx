import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "./store/useUserStore";
import { useThemeStore } from "./store/useThemeStore";
import Loading from "./components/Loading";
import Success from "./components/Success";
import MainLayout from "./layout/Mainlayout";
import HereSection from "./components/HereSection";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Restaurant from "./Admin/Restaurant";
import AddMenu from "./Admin/AddMenu";
import Orders from "./Admin/Orders";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import Signup from "./Auth/Signup";
import ResetPassword from "./Auth/ResetPassword";
import VerifyEmail from "./Auth/VerifyEmail";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  
  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.admin) return <Navigate to="/" replace />;
  
  return children;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: "/", element: <HereSection /> },
      { path: "/profile", element: <Profile /> },
      { path: "/search/:text", element: <SearchPage /> },
      { path: "/restaurant/:id", element: <RestaurantDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/order/status", element: <Success /> },

      // Admin routes
      { path: "/admin/restaurant", element: <AdminRoute><Restaurant /></AdminRoute> },
      { path: "/admin/menu", element: <AdminRoute><AddMenu /></AdminRoute> },
      { path: "/admin/orders", element: <AdminRoute><Orders /></AdminRoute> },
    ],
  },
  { path: "/login", element: <AuthenticatedUser><Login /></AuthenticatedUser> },
  { path: "/signup", element: <AuthenticatedUser><Signup /></AuthenticatedUser> },
  { path: "/forgot-password", element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/verify-email", element: <VerifyEmail /> },
]);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const { checkAuthentication, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuthentication();
    initializeTheme();
  }, []); // ✅ No dependencies to avoid infinite re-renders

  if (isCheckingAuth) return <Loading />;

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
