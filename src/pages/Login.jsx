import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/operations/userAPI";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { email, password } = formData;

  const { loading } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Log In</h2>

        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email"
          className="w-full px-4 py-2 border rounded-lg" required />

        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg" required />

        <button disabled={loading} type="submit"
          className="w-full py-2 bg-black text-white font-bold rounded-lg">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
