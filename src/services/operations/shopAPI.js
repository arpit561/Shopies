import { setAllShops, setMyShop } from "../../slices/shopSlice";
import { apiConnector } from "../apiconnector";
import { shopEndpoints } from "../apis";
import { toast } from "react-hot-toast"

const { CREATE_SHOP,
    DELETE_SHOP,
    GET_ALL_SHOPS, GET_MY_SHOPS}= shopEndpoints;


export const createShop = ({ shopName, address, token }) => {
  return async (dispatch) => {
    try {
      console.log("shopName:", shopName, "address:", address);
      console.log("token:", token);

      const response = await apiConnector(
        "POST",
        CREATE_SHOP,
        { shopName, address },
        {
          Authorization: `Bearer ${token}`
        }
      );
      if (response.data.success) {
        toast.success("Shop created!");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error creating shop:", err);
      toast.error("Failed to create shop");
    }
  };
};



export const updateShop = ({ shopId, shopName, address, token }) => {
    return async (dispatch) => {
      try {
        const response = await apiConnector("PUT", `/api/shop/update/${shopId}`, {
          shopName,
          address,
        }, {
          Authorization: `Bearer ${token}`
        })
  
        if (response.data.success) {
          toast.success("Shop updated successfully")
          return response.data.shop
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error("Update shop error:", error)
        toast.error("Failed to update shop")
      }
    }
  }

  
  export const deleteShop = ({ shopId, token }) => {
    return async (dispatch) => {
      try {
        const response = await apiConnector("DELETE", `${DELETE_SHOP}/${shopId}`, null, {
          Authorization: `Bearer ${token}`
        })
  
        if (response.data.success) {
          toast.success("Shop deleted successfully")
          // Optionally refetch shop list or navigate
        } else {
          toast.error(response.data.message || "Failed to delete shop")
        }
      } catch (err) {
        console.error("Delete shop error:", err)
        toast.error("Error deleting shop")
      }
    }
  }
  

  export const getAllShops = () => {
    return async (dispatch) => {
      try {
        const response = await apiConnector("GET", GET_ALL_SHOPS);
  
        if (response.data.success) {
          dispatch(setAllShops(response.data.shops));
          return response.data.shops;
        } else {
          toast.error(response.data.message);
          return [];
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast.error("Failed to fetch shops");
        return [];
      }
    };
  };
export const getMyShops = () => {
  return async (dispatch) => {
    try {
      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));


      if (!user._id) {
        toast.error("User not logged in");
        return [];
      }

      // Make the API request to fetch shops for the particular shopkeeper
      const response = await apiConnector("GET", `${GET_MY_SHOPS}?ownerId=${user._id}`);

      if (response.data.success) {
        dispatch(setMyShop(response.data.shops));  // Use the appropriate action to set the shops
        return response.data.shops;
      } else {
        toast.error(response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Failed to fetch shops");
      return [];
    }
  };
};