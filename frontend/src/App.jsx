import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/layouts/DashboardLayout"
import WebsiteLayout from "@/layouts/WebsiteLayout"
import WebsiteHome from "@/pages/website/WebsiteHome"
import PlaceholderPage from "@/pages/dashboard/PlaceholderPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Bounce, ToastContainer } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { checkAuthStatus } from "./redux/slice/authSlice"
import { useEffect } from "react"
import Home from "./pages/dashboard/Home"
import Profile from "./pages/dashboard/Profile"
import { LoadingPage } from "@/components/loadingPage"
import ForgotPassword from "./components/shadcn-studio/blocks/forgot-password-01/forgot-password-01"
import TwoFactorAuthentication from "./components/shadcn-studio/blocks/two-factor-authentication-01/two-factor-authentication-01"
import ResetPassword from "./components/shadcn-studio/blocks/reset-password-01/reset-password-01"
import AddExercisePage from "./pages/dashboard/AddExcersise"
import ViewExcersise from "./pages/dashboard/ViewExcersise"

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const forgotemail = useSelector((state) => state.forgot.email);
  const otpVerified = useSelector((state) => state.forgot.otpVerified);

  if (loading) {
    return (<LoadingPage />); 
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Website Routes */}
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<WebsiteHome />} />
          <Route path="profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={loggedIn ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="Excersise/addExcersise" element={<AddExercisePage/>} />
          <Route path="Excersise/viewExcersise" element={<ViewExcersise/>} />
          <Route path="Excersise/addCategory" element={<PlaceholderPage title="View Excersise" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="settings/general" element={<PlaceholderPage title="General Settings" />} />
          <Route path="settings/team" element={<PlaceholderPage title="Team Settings" />} />
          <Route path="settings/billing" element={<PlaceholderPage title="Billing Settings" />} />
          <Route path="settings/limits" element={<PlaceholderPage title="Limits Settings" />} />

        </Route>
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/otpVerify" element={forgotemail ? <TwoFactorAuthentication /> : <Navigate to="/forgetPassword" />} />
        <Route path="/resetPassword" element={forgotemail ? otpVerified ? <ResetPassword /> : <Navigate to="/otpVerify" /> : <Navigate to="/forgetPassword" />} />
        <Route path="/loading" element={<LoadingPage />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </BrowserRouter>
  )
}

export default App