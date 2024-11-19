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