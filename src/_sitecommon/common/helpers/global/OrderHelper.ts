import { PurchaseOrderStatusTypesEnum, UnitTypesEnum } from "../../enums/GlobalEnums";
import { convertToTwoDecimalFloat } from "./GlobalHelper";
import { stringIsNullOrWhiteSpace } from "./ValidationHelper";



export const createOrderUnitLabel = (productUnit: any) => {

    let unitTypeName = "";
    if (productUnit?.unit_type == UnitTypesEnum.Roll) {
        unitTypeName = "Roll";
    } else if (productUnit?.unit_type == UnitTypesEnum.Liquid_Solvent) {
        unitTypeName = "Liquid/Solvent";
    } else if (productUnit?.unit_type == UnitTypesEnum.Granules) {
        unitTypeName = "Granules";
    }

    let labelFinal = "";
    if (productUnit?.unit_type == UnitTypesEnum.Roll) {
        labelFinal = unitTypeName + ' (' + productUnit.unit_sub_type + '-' + (stringIsNullOrWhiteSpace(productUnit.unit_short_name) ? 'Default' : productUnit.unit_short_name) + ')';
    } else {
        labelFinal = unitTypeName + ' (' + (stringIsNullOrWhiteSpace(productUnit.unit_short_name) ? 'Default' : productUnit.unit_short_name) + ')';
    }
   
    return labelFinal;
}



export const calculateTaxValue = (tax_rate: any, product_price: number) => {
    const rate = tax_rate ?? 0; // Convert tax rate to a float
    if (!isNaN(rate)) {
        return (product_price * rate) / 100; // Calculate the tax amount
    } else {
        return 0;
    }
}

export const calculateTaxValueNewFunc = (amount: number, taxType: string, taxValue: number) => {
    let taxAmount = 0;

    if (taxType == 'Fixed') {
        taxAmount = taxValue;
    } else if (taxType == 'Percentage') {
        taxAmount = (amount * taxValue) / 100;
    } else {
        return 0;
    }

    return convertToTwoDecimalFloat(taxAmount);
}


export const calculateItemLevelTaxValueNew = (productItem: any) => {

    let taxRateType = productItem.tax_rate_type;
    if (taxRateType == undefined || taxRateType == null || stringIsNullOrWhiteSpace(taxRateType) == true) {
        return 0;
    }
    let amount = (productItem.price ?? 0) * (productItem.quantity ?? 1);
    let itemTotalTax = calculateTaxValueNewFunc(amount, taxRateType, (productItem.tax_value ?? 0));
    return (itemTotalTax ?? 0);
}

export const calculateItemLevelTaxValueNewForPO = (productItem: any) => {

    let taxRateType = productItem.tax_rate_type;
    if (taxRateType == undefined || taxRateType == null || stringIsNullOrWhiteSpace(taxRateType) == true) {
        return 0;
    }
    let amount = (productItem.price ?? 0) * (productItem.weight_value ?? 1);
    let itemTotalTax = calculateTaxValueNewFunc(amount, taxRateType, (productItem.tax_value ?? 0));
    return (itemTotalTax ?? 0);
}

export const calculatePurchaseOrderLineItem = (productItem: any) => {
    // Calculate subtotal
    productItem.subtotal = (productItem.price || 0) * (productItem.weight || 0);
    productItem.discounted_subtotal = (productItem.subtotal || 0) - (productItem.discount || 0);

    // Calculate taxes
    productItem.tax_1_amount = (productItem.discounted_subtotal/100) * (productItem.tax_1_percentage || 0);
    productItem.tax_2_amount = (productItem.discounted_subtotal/100) * (productItem.tax_2_percentage || 0);
    productItem.tax_3_amount = (productItem.tax_1_amount/100) * (productItem.tax_3_percentage || 0);
    productItem.total_tax = productItem.tax_1_amount + productItem.tax_2_amount + productItem.tax_3_amount;

    // Calculate total
    productItem.total = productItem.discounted_subtotal + productItem.total_tax;
    return productItem;
}


export const calculatePurchaseOrderCartSummary = (cart: any, allProducts: any, new_tax_percentage?: any, new_discount?: any) => {
    const tax_percentage = new_tax_percentage ?? cart.tax_percentage;
    const discount = new_discount ?? cart.discount;
    let subtotal = 0;
    let total_line_item_tax = 0;
    let total_line_item_discount = 0;
    let tax_amount = 0;
    let total_tax = 0;
    let total_discount = 0;
    allProducts.forEach((productItem: any) => {
        subtotal += productItem.total;
        total_line_item_tax += productItem.total_tax || 0;
        total_line_item_discount += productItem.discount || 0;
    });
    tax_amount = (subtotal / 100) * (tax_percentage || 0);
    total_tax = total_line_item_tax + tax_amount;
    total_discount = total_line_item_discount + (discount || 0);
    const total = subtotal + tax_amount - discount;
    return { subtotal, total_line_item_tax, total_line_item_discount, tax_percentage, discount, tax_amount, total_discount, total_tax, total }
}


export const calculateItemAmount = (po_rate: any, itemQuantity: any) => {

    const poRate = convertToTwoDecimalFloat(po_rate);
    const quantity = convertToTwoDecimalFloat(itemQuantity ?? 1);


    const amount = convertToTwoDecimalFloat((poRate * quantity));

    return amount;
}



export const calculateOrderItemAmount = (productItem: any) => {

    const itemQuantity: number = parseInt(productItem?.quantity ?? 1) ?? 1;
    const itemPrice: number = parseInt(productItem?.price ?? 0) ?? 0;
    let itemTotalTax: number = 0;

    let itemAmount = calculateItemAmount(itemPrice, itemQuantity);
    itemTotalTax = calculateItemLevelTaxValueNew(productItem);


    const itemTotal: number = itemAmount + itemTotalTax;
    productItem.itemTotal = itemTotal;
    productItem.itemTotalTax = itemTotalTax;




    return itemTotal;

}

export const calculateOrderItemAmountForPO = (productItem: any) => {
    const itemValue: number = parseInt(productItem?.weight_value ?? 1) ?? 1;
    const itemPrice: number = parseInt(productItem?.price ?? 0) ?? 0;
    let itemTotalTax: number = 0;

    let itemAmount = calculateItemAmount(itemPrice, itemValue);
    itemTotalTax = calculateItemLevelTaxValueNewForPO(productItem);


    const itemTotal: number = itemAmount + itemTotalTax;
    productItem.itemTotal = itemTotal;
    productItem.itemTotalTax = itemTotalTax;




    return itemTotal;

}


export const calculateItemsSubTotal = (cartAllProducts: any) => {
    
    let finalItemTotal: any = 0;
    finalItemTotal = cartAllProducts?.reduce((total: any, product: any) => total + product.itemTotal, 0);
    return convertToTwoDecimalFloat(finalItemTotal ?? "0");
};

export const getTaxRateByTaxRuleId = (allTaxRules: any, taxRuleId: number) => {

    const orderLevelTax = allTaxRules.find((x: { tax_rule_id: number; }) => x.tax_rule_id == taxRuleId);
    if (orderLevelTax && orderLevelTax.tax_rate) {
        return convertToTwoDecimalFloat(orderLevelTax.tax_rate ?? 0);
    } else {
        return 0;
    }

};


export const calculateJobCardAmountMaster = (quanity: number, rate: number) => {

    let finalItemTotal = 0;
    finalItemTotal = (quanity ?? 0) * (rate ?? 0);
    return parseFloat(finalItemTotal?.toFixed(2) ?? 0);
};




export const  getPurchaseOrderStatusClass = (statusId: number) => {
    switch (statusId) {
        case PurchaseOrderStatusTypesEnum.Complete:
            return 'badge badge-light-success';
        case PurchaseOrderStatusTypesEnum.Pending:
            return 'badge badge-light-warning';
        case PurchaseOrderStatusTypesEnum.Cancel:
            return 'badge badge-light-info';
        default:
            return 'badge badge-light-info'; // Return an empty string or a default class if needed
    }
  }