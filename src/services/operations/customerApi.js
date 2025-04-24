import toast from "react-hot-toast";
import { setCustomerDetails, setCustomerLoading, setCustomers } from "../../slices/customerSlice";
import { apiConnector } from "../apiconnector";
import { customerEndpoints } from "../apis";
import axios from "axios";


const {CREATE_OR_UPDATE_CUSTOMER,
  GET_CUSTOMERS_BY_SHOP,
  GET_MY_CUSTOMERS,
  GET_CUSTOMER_WITH_ITEMS,
  DELETE_CUSTOMER} = customerEndpoints;


export const createOrUpdateCustomer = (data) => {
  return async (dispatch) => {
    dispatch(setCustomerLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_OR_UPDATE_CUSTOMER, data);
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.customer;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      toast.error("Failed to create/update customer");
      return null;
    } finally {
      dispatch(setCustomerLoading(false));
    }
  };
};


// export const getCustomersByShop = (shopId, token) => async (dispatch) => {
//     try {
//       const response = await apiConnector("GET", `${GET_CUSTOMERS_BY_SHOP}/getCustomersByShop/${shopId}`, null, {
//         Authorization: `Bearer ${token}`,
//       });
//       dispatch(setCustomers(response.data.data));
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       return [];
//     }
//   };
  


// export const getCustomersByShop = (shopId, token) => {
//   return async (dispatch) => {
//     dispatch(setCustomerLoading(true));
//     try {
//       const response = await apiConnector("GET", `${GET_CUSTOMERS_BY_SHOP}/${shopId}`, null, {
//          Authorization: `Bearer ${token}`,
//       });
//       if (response.data.success) {
//         dispatch(setCustomers(response.data.data));
//         return response.data.data;
//       } else {
//         toast.error(response.data.message);
//         return [];
//       }
//     } catch (error) {
//       toast.error("Failed to fetch customers");
//       return [];
//     } finally {
//       dispatch(setCustomerLoading(false));
//     }
//   };
// };



export const getCustomersByShop = (shopId, token) => async (dispatch) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/shopkeeper/getCustomersByShop/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const customers = res.data?.data || [];
      dispatch(setCustomers(customers));
      console.log("Customers: ", customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };



export const getMyCustomers = (shopId) => {
  return async (dispatch) => {
    dispatch(setCustomerLoading(true));
    try {
      const url = shopId ? `${GET_MY_CUSTOMERS}?shopId=${shopId}` : GET_MY_CUSTOMERS;
      const response = await apiConnector("GET", url);
      if (response.data.success) {
        dispatch(setCustomers(response.data.customers));
        return response.data.customers;
      } else {
        toast.error(response.data.message);
        return [];
      }
    } catch (error) {
      toast.error("Failed to fetch my customers");
      return [];
    } finally {
      dispatch(setCustomerLoading(false));
    }
  };
};

export const getCustomerWithItems = (customerId) => {
  return async (dispatch) => {
    dispatch(setCustomerLoading(true));
    try {
      const response = await apiConnector("GET", `${GET_CUSTOMER_WITH_ITEMS}/${customerId}`);
      if (response.data.success) {
        dispatch(setCustomerDetails(response.data.data));
        return response.data.data;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      toast.error("Failed to fetch customer details");
      return null;
    } finally {
      dispatch(setCustomerLoading(false));
    }
  };
};

export const deleteCustomer = (customerId, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", `${DELETE_CUSTOMER}/${customerId}`, null, {
        Authorization: `Bearer ${token}`});
      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error("Error deleting customer");
      return false;
    }
  };
};
