// import React, { useState } from "react";
// import axios from "axios";

// const CustomerForm = ({ shopId, onSuccess }) => {
//   const [form, setForm] = useState({
//     name: "",
//     contactInfo: "",
//     unpaidItems: [{ itemName: "", price: "" }],
//   });

//   const handleItemChange = (index, e) => {
//     const updatedItems = [...form.unpaidItems];
//     updatedItems[index][e.target.name] = e.target.value;
//     setForm({ ...form, unpaidItems: updatedItems });
//   };

//   const addItem = () => {
//     setForm({
//       ...form,
//       unpaidItems: [...form.unpaidItems, { itemName: "", price: "" }],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "/api/customers/createOrUpdateCustomer",
//         { ...form, shopId },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       alert("Customer added/updated!");
//       setForm({ name: "", contactInfo: "", unpaidItems: [{ itemName: "", price: "" }] });
//       if (onSuccess) onSuccess();
//     } catch (err) {
//       console.error(err);
//       alert("Error adding customer");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         name="name"
//         placeholder="Customer Name"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         className="border p-2 w-full rounded"
//         required
//       />
//       <input
//         name="contactInfo"
//         placeholder="Contact Info"
//         value={form.contactInfo}
//         onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
//         className="border p-2 w-full rounded"
//         required
//       />

//       {form.unpaidItems.map((item, index) => (
//         <div key={index} className="flex gap-2">
//           <input
//             name="itemName"
//             placeholder="Item Name"
//             value={item.itemName}
//             onChange={(e) => handleItemChange(index, e)}
//             className="border p-2 w-full rounded"
//             required
//           />
//           <input
//             name="price"
//             placeholder="Price"
//             type="number"
//             value={item.price}
//             onChange={(e) => handleItemChange(index, e)}
//             className="border p-2 w-full rounded"
//             required
//           />
//         </div>
//       ))}
//       <button type="button" onClick={addItem} className="text-blue-600">
//         + Add another item
//       </button>

//       <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 p-2 rounded w-full">
//         Save Customer
//       </button>
//     </form>
//   );
// };

// export default CustomerForm;



import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createOrUpdateCustomer } from "../../services/operations/customerApi"; // adjust path if needed
import toast from "react-hot-toast";

const CustomerForm = ({ shopId, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    contactInfo: "",
    unpaidItems: [{ itemName: "", price: "" }],
  });

  const dispatch = useDispatch();

  const handleItemChange = (index, e) => {
    const updatedItems = [...form.unpaidItems];
    updatedItems[index][e.target.name] = e.target.value;
    setForm({ ...form, unpaidItems: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      unpaidItems: [...form.unpaidItems, { itemName: "", price: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const result = dispatch(createOrUpdateCustomer({ ...form, shopId, token }));

    if (result) {
      // toast.success("Added successfully");
      setForm({ name: "", contactInfo: "", unpaidItems: [{ itemName: "", price: "" }] });
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Customer Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="contactInfo"
        placeholder="Contact Info"
        value={form.contactInfo}
        onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
        className="border p-2 w-full rounded"
        required
      />

      {form.unpaidItems.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            name="itemName"
            placeholder="Item Name"
            value={item.itemName}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-2 w-full rounded"
            required
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={item.price}
            onChange={(e) => handleItemChange(index, e)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-blue-600">
        + Add another item
      </button>

      <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 p-2 rounded w-full">
        Save Customer
      </button>
    </form>
  );
};

export default CustomerForm;
