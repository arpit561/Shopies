import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/userAPI";
import { useDispatch } from "react-redux";
import { setSignupData } from "../slices/authSlice";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    // image: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }
    setLoading(true);
    try {
      dispatch(setSignupData(form));
      //   alert("Signup successful!");
      //   navigate("/verify-email");
      dispatch(sendOtp(form.email, navigate));
      navigate("/verify-email");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="customer">Customer</option>
          <option value="shopkeeper">Shopkeeper</option>
        </select>

        {/* <input type="file" name="image" onChange={handleChange} accept="image/*"
          className="w-full px-4 py-2 border rounded-lg" required /> */}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-center text-lg text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
