


export const calculateTaxValue = (tax_rate: any, product_price: number) => {
    const rate = tax_rate ?? 0; // Convert tax rate to a float
    if (!isNaN(rate)) {
        return (product_price * rate) / 100; // Calculate the tax amount
    } else {
        return 0;
    }
}

export const calculateItemAmount = (po_rate: any, itemQuantity: any) => {

    const poRate = parseInt(po_rate?.toString() ?? '0', 10);
    const quantity = parseInt(itemQuantity?.toString() ?? '1', 10);

    const amount = poRate * quantity;

    return amount;
}


export const calculateOrderItemAmount = (productItem: any, allProductTaxes: any) => {

    const itemQuantity: number = parseInt(productItem?.quantity ?? 1) ?? 1;
    const itemPrice: number = parseInt(productItem?.price ?? 0) ?? 0;
    let itemTaxValue: number = 0;

    let itemAmount = calculateItemAmount(itemPrice, itemQuantity);

    const itemTaxSelected = allProductTaxes?.find((x: { tax_rule_id: any; }) => x.tax_rule_id == productItem?.product_tax_rule_id);
    if (itemTaxSelected && itemTaxSelected.tax_rule_id > 0) {
        itemTaxValue = calculateTaxValue(itemTaxSelected.tax_rate, itemAmount);
        productItem.taxRateItem = itemTaxSelected.tax_rate;
    }

    // Calculate the total item cost including tax
    //const itemTotal: number = (itemPrice + itemTaxValue) * itemQuantity;
    const itemTotal: number = itemAmount + itemTaxValue;
    productItem.itemTotal = itemTotal;
    productItem.itemTotalTax = itemTaxValue;
   


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


