const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH ENDPOINTS
// =========================
export const authEndpoints = {
  SEND_OTP: `${BASE_URL}/users/sendotp`,
  SIGNUP: `${BASE_URL}/users/register`,
  LOGIN: `${BASE_URL}/users/login`,
};
console.log("BASE_URL is:", BASE_URL);


// ADMIN-PROTECTED ROUTES
// =========================
export const adminEndpoints = {
  GET_ALL_SHOPKEEPERS: `${BASE_URL}/admin/shopkeepers`,
  GET_ALL_SHOPS: `${BASE_URL}/admin/shops`,
  DELETE_SHOP: `${BASE_URL}/admin/shopDelete`,
  TOGGLE_SHOPKEEPER_STATUS: `${BASE_URL}/admin/toggle-shopkeeper`,
  GET_BLOCKED_SHOPKEEPERS: `${BASE_URL}/admin/shopkeepers/blocked`,
};

// CUSTOMER ENDPOINTS (Protected)
// ===============================
export const customerEndpoints = {
  CREATE_OR_UPDATE_CUSTOMER: `${BASE_URL}/shopkeeper/createOrUpdateCustomer`,
  GET_CUSTOMERS_BY_SHOP: `${BASE_URL}/shopkeeper/getCustomersByShop`,
  GET_MY_CUSTOMERS: `${BASE_URL}/shopkeeper/getMyCustomers`,
  GET_CUSTOMER_WITH_ITEMS: `${BASE_URL}/shopkeeper/getCustomerWithItems`,
  DELETE_CUSTOMER: `${BASE_URL}/shopkeeper/deleteCustomer`,
};

// ITEM ROUTES FOR CUSTOMERS
// =============================
export const itemEndpoints = {
    ADD_ITEM: `${BASE_URL}/items/addItem`,
    UPDATE_ITEM: `${BASE_URL}/items/updateItem`,
    DELETE_ITEM: `${BASE_URL}/items/deleteItem`,
    GET_ITEMS_BY_CUSTOMER_ID: `${BASE_URL}/items/find`,
    MARK_ITEMS_AS_PAID: `${BASE_URL}/items/markItemsAsPaid`,
    MARK_ITEM_AS_PAID: `${BASE_URL}/items/markItemAsPaid`,
  };


  // PAYMENT ENDPOINTS
// ===========================
export const paymentEndpoints = {
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
  };

  // SALES & RECORDS ENDPOINTS
// ============================
export const salesEndpoints = {
    ADD_OR_UPDATE_MONTHLY_RECORD:
      `${BASE_URL}/sales/monthlyRecords`,
  
    GET_SALES_HISTORY: `${BASE_URL}/sales/historyRecords`,
  };
  
  // SHOP ROUTES
// =====================
export const shopEndpoints = {
    CREATE_SHOP: `${BASE_URL}/shops/create`,
    DELETE_SHOP: `${BASE_URL}/shops/delete`,
    GET_ALL_SHOPS: `${BASE_URL}/shops/all`,
  };

  // TRANSACTION ROUTES
// ==========================
export const transactionEndpoints = {
    CREATE_TRANSACTION: `${BASE_URL}/transactions/create`,
    GET_ALL_TRANSACTIONS: `${BASE_URL}/transactions/all`,
  };
