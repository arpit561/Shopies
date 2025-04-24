// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { getCustomersByShop, deleteCustomer } from "../../services/operations/customerApi";

// const CustomerList = ({ shopId }) => {
//   const dispatch = useDispatch();
//   const customers = useSelector((state) => state.customer.customers || []);

//   const fetchCustomers = async () => {
//     const rawToken = localStorage.getItem("token");
//     const token = rawToken?.replace(/^"|"$/g, "");
//     dispatch(getCustomersByShop(shopId, token)); 
//   };

//   const handleDelete = async (id) => {
//     const rawToken = localStorage.getItem("token");
//     const token = rawToken?.replace(/^"|"$/g, "");
//     if (!window.confirm("Delete this customer?")) return;
//     const success = dispatch(deleteCustomer(id, token));
//     if (success) {
//       fetchCustomers();
//     }
//   };

//   useEffect(() => {
//     if (shopId) {
//       fetchCustomers();
//     }
//   }, [shopId]);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-bold">Customers</h2>
//       {customers.map((c) => (
//         <div
//           key={c._id}
//           className="border p-4 rounded shadow flex justify-between items-center"
//         >
//           <div>
//             <h3 className="font-semibold">{c.name}</h3>
//             <p>{c.contactInfo}</p>
//           </div>
//           <div className="space-x-2">
//             <Link to={`/customers/${c._id}`} className="text-blue-500 hover:underline">
//               View
//             </Link>
//             <button
//               onClick={() => handleDelete(c._id)}
//               className="text-red-600 hover:underline"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CustomerList;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomersByShop } from "../../services/operations/customerApi";
import { Link } from "react-router-dom";

const CustomerList = ({ shopId }) => {
  const dispatch = useDispatch();


  const [empData, setEmpData] = useState([]);

  const getAllData = async () => {
        const rawToken = localStorage.getItem("token");
    const token = rawToken?.replace(/^"|"$/g, "");
    try {
      const getPeople = await fetch(
        `${process.env.REACT_APP_BASE_URL}/shopkeeper/getCustomersByShop/${shopId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await getPeople.json();
      setEmpData(res.data);

      console.log("customers: ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  },[]);
  console.log(empData);

  // const customers = useSelector((state) => state.customer.customers);
  // console.log("Customers: ", customers);

  // useEffect(() => {
  //   if (shopId) {
  //     const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  //     dispatch(getCustomersByShop(shopId, token)); 
  //     console.log("Customers from Redux:", customers);
  //   }
  // }, [shopId, dispatch]);

  // // Log customers to check if they are fetched and stored correctly
  // useEffect(() => {
  //   console.log("Customers from Redux: ", customers);  // This should show your fetched customers
  // }, [customers]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Customers</h2>
      {!empData ? (
        <p>No customers found for this shop.</p>
      ) : (
        empData.map((customer) => (
          <div key={customer._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{customer.name}</h3>
            <p>Contact: {customer.contactInfo}</p>
            <p>Unpaid Items: {customer.unpaidItems.length}</p>
            <Link to={`/customers/${customer._id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerList;
