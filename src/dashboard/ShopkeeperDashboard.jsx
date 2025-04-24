import React, { useEffect, useState } from "react";
import CustomerForm from "./shopkeeper/CustomerForm";
import CustomerList from "./shopkeeper/CustomerList";
import { useDispatch, useSelector } from "react-redux";
import { getAllShops, createShop } from "../services/operations/shopAPI";
import { toast } from "react-hot-toast";
import { setMyShop } from "../slices/shopSlice";
import { useNavigate } from "react-router-dom";  // import useNavigate from react-router-dom

const ShopkeeperDashboard = () => {
    // const [shops, setShops] = useState([]);
  const shops = useSelector((state) => state.shop.shops);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    const result = dispatch(getAllShops());
    if (result && Array.isArray(result)) {
      setMyShop(result);
      if (result.length === 1) setSelectedShopId(result[0]._id);
    }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    const rawToken = localStorage.getItem("token");
    const token = rawToken?.replace(/^"|"$/g, "");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }
    dispatch(createShop({ shopName, address, token }));
    setShowCreateForm(false);
    setShopName("");
    setAddress("");
    fetchShops(); // refresh list after creation
  };

  // Function to update the URL with selected shopId
  const updateUrlWithShopId = (shopId) => {
    navigate(`/getCustomersByShop/${shopId}`);  // Update URL to reflect the selected shop
  };

  const handleShopSelection = (shopId) => {
    setSelectedShopId(shopId);
    updateUrlWithShopId(shopId);  // Update the URL when a shop is selected
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Shopkeeper Dashboard</h1>

      {/* Shop Selector */}
      {shops.length > 1 && (
        <div>
          <label className="block mb-2 font-semibold">Select Shop:</label>
          <select
            className="border p-2 w-full rounded"
            value={selectedShopId || ""}
            onChange={(e) => handleShopSelection(e.target.value)}  // Call handleShopSelection
          >
            <option value="" disabled>
              Select a shop
            </option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.shopName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Customer Form & List */}
      {selectedShopId ? (
        <>
          <CustomerForm shopId={selectedShopId} onSuccess={fetchShops} />
          <CustomerList shopId={selectedShopId} />
        </>
      ) : (
        <p className="text-gray-500">
          Please select a shop to manage customers.
        </p>
      )}

      {/* Create Shop Form */}
      <div className="mt-6 text-center">
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            + Create New Shop
          </button>
        ) : (
          <form onSubmit={handleCreateShop} className="space-y-3 mt-4">
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Shop name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop address"
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex space-x-2 justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-400"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setShopName("");
                  setAddress("");
                }}
                className="px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;





// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllShops, createShop } from "../services/operations/shopAPI";
// import { toast } from "react-hot-toast";
// import CustomerForm from "./shopkeeper/CustomerForm";
// import { getCustomersByShop } from "../services/operations/customerApi";

// const ShopkeeperDashboard = () => {
//   const shops = useSelector((state) => state.shop.shops);
//   const [selectedShopId, setSelectedShopId] = useState("");
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState("");
//   const [shopName, setShopName] = useState("");
//   const [address, setAddress] = useState("");
//   const [showCreateForm, setShowCreateForm] = useState(false);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllShops());
//   }, []);

//   useEffect(() => {
//     if (selectedShopId) fetchCustomers(selectedShopId);
//     // console.log("selectedShopId: ", selectedShopId);
//   }, [selectedShopId]);

//   const fetchCustomers = async (shopId) => {
//     const rawToken = localStorage.getItem("token");
//     const token = rawToken?.replace(/^"|"$/g, "");
//     try {
//       const res =  dispatch(getCustomersByShop(shopId, token));
//       if (Array.isArray(res)) setCustomers(res);
//     } catch (err) {
//       toast.error("Failed to load customers");
//     }
//   };

//   const handleCreateShop = async (e) => {
//     e.preventDefault();
//     const rawToken = localStorage.getItem("token");
//     const token = rawToken?.replace(/^"|"$/g, "");
//     if (!token) {
//       toast.error("You must be logged in");
//       return;
//     }
//     dispatch(createShop({ shopName, address, token }));
//     setShowCreateForm(false);
//     setShopName("");
//     setAddress("");
//     dispatch(getAllShops()); // Refresh
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-bold text-center">Shopkeeper Dashboard</h1>

//       {/* Select Shop */}
//       <div>
//         <label className="block mb-1 font-semibold">Select Shop:</label>
//         <select
//           className="border p-2 w-full rounded"
//           value={selectedShopId}
//           onChange={(e) => setSelectedShopId(e.target.value)}
//         >
//           <option value="" disabled>Select a shop</option>
//           {shops.map((shop) => (
//             <option key={shop._id} value={shop._id}>
//               {shop.shopName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Select Customer (dropdown) */}
//       {selectedShopId && (
//         <div>
//           <label className="block mb-1 font-semibold">Select Customer:</label>
//           <select
//             className="border p-2 w-full rounded"
//             value={selectedCustomerId}
//             onChange={(e) => setSelectedCustomerId(e.target.value)}
//           >
//             <option value="" disabled>Select a customer</option>
//             {customers.map((customer) => (
//               <option key={customer._id} value={customer._id}>
//                 {customer.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Create Customer */}
//       {selectedShopId && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold mb-2">Create or Update Customer</h2>
//           <CustomerForm shopId={selectedShopId} onSuccess={() => fetchCustomers(selectedShopId)} />
//         </div>
//       )}

//       {/* Create Shop */}
//       <div className="mt-6 text-center">
//         {!showCreateForm ? (
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
//           >
//             + Create New Shop
//           </button>
//         ) : (
//           <form onSubmit={handleCreateShop} className="space-y-3 mt-4">
//             <input
//               type="text"
//               value={shopName}
//               onChange={(e) => setShopName(e.target.value)}
//               placeholder="Shop name"
//               className="w-full p-2 border rounded"
//               required
//             />
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Shop address"
//               className="w-full p-2 border rounded"
//               required
//             />
//             <div className="flex space-x-2 justify-center">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
//               >
//                 Create
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowCreateForm(false);
//                   setShopName("");
//                   setAddress("");
//                 }}
//                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopkeeperDashboard;
