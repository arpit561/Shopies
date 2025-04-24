import { Route, Routes } from "react-router-dom";
import "./App.css";
import OpenRoute from "./components/OpenRoute";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./dashboard/PrivateRoute";
import ShopkeeperDashboard from "./dashboard/ShopkeeperDashboard";
import CustomerDashboard from "./dashboard/CustomerDashboard";
import ShopForm from "./dashboard/shopkeeper/ShopForm";
import ShopList from "./dashboard/shopkeeper/ShopList";
import CustomerDetail from "./dashboard/shopkeeper/CustomerDetail";

function App() {
  // const { shopId } = useParams();
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="/dashboard/shopkeeper"
          element={
            <PrivateRoute>
              <ShopkeeperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/getCustomersByShop/:shopId"
          element={
            <PrivateRoute>
              <ShopkeeperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/shop/create" element={<ShopForm />} />
        <Route path="/shops" element={<ShopList />} />

        {/* <Route path="/" element={
            <>
              <CustomerForm shopId={shopId} onSuccess={() => window.location.reload()} />
              <CustomerList shopId={shopId} />
            </>
          } /> */}
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
      </Routes>
    </div>
  );
}

export default App;
