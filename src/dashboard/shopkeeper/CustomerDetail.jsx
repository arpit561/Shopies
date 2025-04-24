import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/customers/getCustomerWithItems/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCustomer(res.data.data))
      .catch((err) => console.error(err));
  }, [customerId]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{customer.name}</h2>
      <p className="text-gray-600">{customer.contactInfo}</p>
      <p className="text-sm mt-1">Shop: {customer.shopId?.shopName}</p>

      <h3 className="mt-4 font-semibold">Unpaid Items:</h3>
      <ul className="list-disc list-inside space-y-1">
        {customer.unpaidItems.map((item) => (
          <li key={item._id}>
            {item.itemName} - ₹{item.price} ({new Date(item.dateTaken).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDetail;
