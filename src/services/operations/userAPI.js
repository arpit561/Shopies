import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const { SEND_OTP, SIGNUP, LOGIN } = authEndpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SEND_OTP, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      //console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // dispatch(setSignupData({ email }));
      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      //console.log("SENDOTP API ERROR............", error);
      if (error.response) {
        // console.log("Error Data:", error.response.data);
        toast.error(error.response.data.message);
        console.log("SENDOTP_API URL:", SEND_OTP);
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
      toast.error("Could Not Send OTP");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  name,
  phone,
  email,
  password,
  confirmPassword,
  role,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log("BASE_URL", authEndpoints.SIGNUP);
    console.log("Signup Payload:", {
      name,
      phone,
      email,
      password,
      confirmPassword,
      role,
      otp,
    });
    try {
      const response = await apiConnector("POST", SIGNUP, {
        name,
        phone,
        email,
        password,
        confirmPassword,
        role,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Unknown error");
      }
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      // console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed");
      navigate("/");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN, {
        email,
        password,
      });

      // console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.name}`;
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data?.user?.role;
      console.log("Role: ", role);
      if (role === "shopkeeper") {
        navigate("/dashboard/shopkeeper");
      } else if (role === "customer") {
        navigate("/dashboard/customer");
      }
    } catch (error) {
      // console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
