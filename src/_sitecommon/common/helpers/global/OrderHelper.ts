import { stringIsNullOrWhiteSpace } from "./ValidationHelper";



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

    return taxAmount;
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


export const calculateItemAmount = (po_rate: any, itemQuantity: any) => {

    const poRate = parseInt(po_rate?.toString() ?? '0', 10);
    const quantity = parseInt(itemQuantity?.toString() ?? '1', 10);

    const amount = poRate * quantity;

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


export const calculateItemsSubTotal = (cartAllProducts: any) => {
    let finalItemTotal = 0;
    finalItemTotal = cartAllProducts?.reduce((total: any, product: any) => total + product.itemTotal, 0);
    return parseInt(finalItemTotal?.toFixed(2) ?? 0);
};

export const getTaxRateByTaxRuleId = (allTaxRules: any, taxRuleId: number) => {

    const orderLevelTax = allTaxRules.find((x: { tax_rule_id: number; }) => x.tax_rule_id == taxRuleId);
    if (orderLevelTax && orderLevelTax.tax_rate) {
        return parseInt(orderLevelTax.tax_rate ?? 0)?.toFixed(2);
    } else {
        return 0;
    }

};


