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


export const inventoryUnits = {
  ORDER_TOTAL: 1,
  ORDER_SUBTOTAL: 2,
  PRODUCTS: 3,
  CATEGORIES: 4,
  MANUFACTURERS: 5,
  CITIES: 6,
  SHIPPING: 7
};

export enum InventoryUnits {
  KG = '1',
  LB = '2',
  LITRE = '3',
  INCH = '4',
  MM = '5',
  METRE = '6',
}

export enum UserRole {
  Admin = 'admin',
  Accounts = 'accounts',
  Office = 'office',
  Factory = 'factory',
}

export enum ProductTypeEnum {
  Solvent = '1',
  Granule = '2',
  Roll = '3',
}

export enum ProductSourceEnum {
  PurchaseOrder = 'PurchaseOrder',
  JobCard = 'JobCard',
  Recycle = 'Recycle'
}

export enum OrderTaxStatusEnum {
  Taxable = '1',
  NonTaxable = '2',
}

export enum PurchaseOrderStatusTypesEnum {
  Pending = 1,
  Complete = 2,
  Cancel = 3,
  Approve = 4,

}
export enum MachineTypesEnum {
  Extruder = 1,
  Cutting = 2,
  Printing = 3,
  Lamination = 4,
  Slitting = 5
}

export enum GrnVoucherStatus {
  Issued = "Issued",
  Cancelled = "Cancelled",
}
