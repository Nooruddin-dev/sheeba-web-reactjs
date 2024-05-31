export const dataOperationTypeConst = {
    Insert: 1,
    Update: 2,
    Delete: 3,
    ViewAll: 5,
  };
  
  export const sqlDeleteTypesConst : any = {
    plainTableDelete: 1,
    foreignKeyDelete: 2,
  };
  export const paymentMethodsConst : any = {
    cashOnDelivery: 1,
    stripe: 2,
    payPal: 3
  };

  export const orderStatusesConst : any = {
    Active: 1,
    InProgress: 2,
    Completed: 3,
    Returned: 4,
    Refuned: 5,
    Cancelled: 6
  };

  export const shiftCashDrawerReconciliationStatusesConst : any = {
    Balanced: 1,
    Over: 2,
    Under: 3,
   
  };


  export const orderTypesConst : any = {
    DINE_IN: 1,
    TAKE_AWAY: 2,
  };
  export const taxRulesTypesConst : any = {
    ForProduct: 'For Product',
    ForOrder: 'For Order',
  };

  export const DiscountTypesEnum = {
    ORDER_TOTAL: 1,
    ORDER_SUBTOTAL: 2,
    PRODUCTS: 3,
    CATEGORIES: 4,
    MANUFACTURERS: 5,
    CITIES: 6,
    SHIPPING: 7
};