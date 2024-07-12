import React, { useEffect, useRef, useState } from 'react'
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { createGrnVoucherApi, gerPurchaseOrdersListForGrnVoucherBySearchTermApi, getPurchaseOrderDetailsForGrnVoucherApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import ReactSelect from 'react-select';
import { calculateItemAmount, calculateItemLevelTaxValueNew, calculateItemsSubTotal, calculateOrderItemAmount, calculateTaxValueNewFunc, createOrderUnitLabel } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { convertToTwoDecimalFloat } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import GrnVoucherReceiptModal from './GrnVoucherReceiptModal';

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
    }),
    // input: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
    // singleValue: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
    // placeholder: (provided: any) => ({
    //     ...provided,
    //     border: 'none',
    //     boxShadow: 'none'
    // }),
};


export default function CreateGrnVoucherPageSub() {

    const navigate = useNavigate();
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);


    
    const [purchaseOrderId, setPurchaseOrderId] = useState<any>(null);
    const [latestGrnVoucherId, setLatestGrnVoucherId] = useState<any>(0);

    const [cartAllProducts, setCartAllProducts] = useState<any>([]);
    const [selectedOrderItemDropDown, setSelectedOrderItemDropDown] = useState<any>(null);
    const [searchQueryOrder, setSearchQueryOrder] = useState('');
    const [selectedSearchOrderOptions, setSelectedSearchOrderOptions] = useState([]);


    const [cartItemTotlal, setCartItemTotlal] = useState<number>(0);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [grandTaxAmount, setGrandTaxAmount] = useState<number>(0);

    const [orderLevelTaxRateType, setOrderLevelTaxRateType] = useState<any>(null);
    const [orderLevelTaxValue, setOrderLevelTaxValue] = useState<any>(0);
    const [orderLevelTaxFinalAmount, setOrderLevelTaxFinalAmount] = useState<number>(0);


    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }



    const createPurchaseOrder = (data: any) => {

        const {po_number, receiver_name, receiver_contact, grn_date,  show_company_detail } = data;
        if (stringIsNullOrWhiteSpace(po_number) || stringIsNullOrWhiteSpace(receiver_name) || stringIsNullOrWhiteSpace(receiver_contact)
            || stringIsNullOrWhiteSpace(grn_date)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (cartAllProducts == undefined || cartAllProducts == null || cartAllProducts.length < 1) {
            showErrorMsg('No item found for this order!');
            return false;
        }

        let cartAllProductsLocal = cartAllProducts?.filter((x: { is_item_checked: boolean; })=>x.is_item_checked == true);
        if (cartAllProductsLocal == undefined || cartAllProductsLocal == null || cartAllProductsLocal.length < 1) {
            showErrorMsg('Please select at least one item!');
            return false;
        }

        let cartGrnVoucherItemsLocal: any = []



       
        cartAllProducts?.filter((x: { is_item_checked: boolean; })=>x.is_item_checked == true)?.forEach((item: any) => {

            cartGrnVoucherItemsLocal.push({
                product_id: item.product_id,
                order_line_item_id: item.line_item_id, //--order line item id
                product_sku_code: item.code_sku,

                quantity: item.quantity ?? 1,
                po_rate: item?.price,
                amount: calculateItemAmount(item.price, item.quantity),

                //product_units_info: item?.product_units_info,
                tax_percent: item.itemTaxPercent,
                tax_rate_type: item?.tax_rate_type,
                tax_value: item.tax_value,
                item_tax_amount_total: item.itemTotalTax,

                grn_item_total: item?.itemTotal,
            })
        });

        if(cartGrnVoucherItemsLocal == undefined || cartGrnVoucherItemsLocal == null || cartGrnVoucherItemsLocal.length == 0){
            showErrorMsg('No item found for this order!');
            return false;
        }


        let formData = {
            purchase_order_id : purchaseOrderId,
            po_number: po_number,
            receiver_name: receiver_name,
            receiver_contact: receiver_contact,
            grn_date: grn_date,
            show_company_detail: show_company_detail ?? true,


            cartGrnVoucherLineItems: cartGrnVoucherItemsLocal,

            orderTotal: orderTotal,

            orderLevelTaxRateType: orderLevelTaxRateType,
            orderLevelTaxValue: orderLevelTaxValue,
            orderLevelTaxAmount: orderLevelTaxFinalAmount,
        }

        createGrnVoucherApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");

                    setCartAllProducts([]);
                    setLatestGrnVoucherId(res?.data?.response?.primaryKeyValue);


                    setIsOpenReceiptModal(true);

                    //--reset the form using form reset() method
                    reset();
                    setFormSubmitted(false);
                    //navigate('/site/purchase-orders-list');

                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });



    };



    const handleSelectPurchaseOrderDropDown = (selectedOption: any) => {

        setSelectedOrderItemDropDown(null);

        const purchase_order_id_selected = selectedOption?.value;

        getPurchaseOrderDetailsForGrnVoucherApi(purchase_order_id_selected)
            .then((res: any) => {
                const { data } = res;
                if (data) {

                    setPurchaseOrderId(data?.purchase_order_id);

                    if (data?.purchase_orders_items && data?.purchase_orders_items.length > 0) {
                        for (const element of data?.purchase_orders_items) {
                            element.is_item_checked = true;
                            element.price =  parseFloat(element?.po_rate ?? "0")?.toFixed(2);

                            const orderItemTax = data?.order_taxes?.find(
                                (x: { line_item_id: number; }) => x.line_item_id === element.line_item_id
                            );
                            if (orderItemTax) {
                                element.tax_rate_type = orderItemTax.tax_rate_type ?? 'Percentage';
                                element.tax_value = parseFloat(orderItemTax.tax_value ?? "0")?.toFixed(2);
                            } else {
                                element.tax_rate_type = 'Percentage';
                                element.tax_value = 0;
                            }

                        }

                        //--get order level tax info and set order level taxes
                        const orderLevelTaxLocal = data?.order_taxes?.find(
                            (x: {
                                line_item_id: undefined; purchase_order_id: number;
                            }) => x.purchase_order_id === data.purchase_order_id && (x.line_item_id == undefined || x.line_item_id == null)
                        );
                        setOrderLevelTaxRateType(orderLevelTaxLocal?.tax_rate_type ?? "Percentage");
                        setOrderLevelTaxValue(orderLevelTaxLocal?.tax_value ?? 0);


                        setCartAllProducts(data?.purchase_orders_items);
                    }



                    setValue('po_number', data.po_number);
                }

            })
            .catch((err: any) => console.log(err, "err"));

    };



    const handleQuantityChange = (index: number, newQuantity: number) => {
        setCartAllProducts((prevCart: any) => {
            const updatedCart = [...prevCart];
            updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
            return updatedCart;
        });
    };

    const handleCheckboxOrderItemChange = (index: number, checked: boolean) => {
        
        const updatedItems = cartAllProducts.map((item: any, idx: number) =>
            idx === index ? { ...item, is_item_checked: checked } : item
        );
        setCartAllProducts(updatedItems);
    };


    const handleProductTaxRateTypeChange = (index: number, event: any) => {
        const { value } = event.target;

        //--first empty this row tax value if rate type change
        setCartAllProducts((prevProducts: any) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].tax_value = 0;
            return updatedProducts;
        });


        setCartAllProducts((prevProducts: any) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].tax_rate_type = value;
            return updatedProducts;
        });
    };

    const hanldeProductTaxValue = (index: number, value: number) => {


        let taxRateType = cartAllProducts[index]?.tax_rate_type;
        if (taxRateType == undefined || taxRateType == null || stringIsNullOrWhiteSpace(taxRateType) == true) {

            showErrorMsg('Please select tax type from drop down!');
            return false;
        }

        setCartAllProducts((prevProducts: any) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].tax_value = value;
            return updatedProducts;
        });
    };



    const handleUnitValueChangeForRollType = (productIndex: number, unitIndex: number, value: number) => {
        const updatedProducts = [...cartAllProducts];
        updatedProducts[productIndex].product_units_info[unitIndex].unit_value = value;
        setCartAllProducts(updatedProducts);

    };



    const removeProductFromCart = (e: any, productid: number) => {
        e.preventDefault();
        setCartAllProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));
    };




    useEffect(() => {
        //--only get checked item from "cartAllProducts"
        let cartAllProductsLocal = cartAllProducts?.filter((x: { is_item_checked: boolean; })=>x.is_item_checked == true);
        if(cartAllProductsLocal ){
            
            let itemTotal = calculateItemsSubTotal(cartAllProductsLocal);
            setCartItemTotlal(itemTotal);
    
            let orderLevelTaxValueLocal = 0;
            if (orderLevelTaxRateType && !stringIsNullOrWhiteSpace(orderLevelTaxRateType)) {
                orderLevelTaxValueLocal = calculateTaxValueNewFunc(itemTotal, orderLevelTaxRateType, (orderLevelTaxValue ?? 0));
    
                itemTotal = itemTotal + orderLevelTaxValueLocal;
                setOrderLevelTaxFinalAmount(orderLevelTaxValueLocal);
            }
    
            //--calcualte all taxes (product level + order level)
            let itemsGrandTotalTax = cartAllProductsLocal?.reduce((total: any, product: any) => total + product.itemTotalTax, 0);
            const itemsGrandTotalTaxNumber = convertToTwoDecimalFloat(itemsGrandTotalTax ?? "0");

            let grandTaxAmount = convertToTwoDecimalFloat((orderLevelTaxValueLocal + itemsGrandTotalTaxNumber));
            grandTaxAmount = grandTaxAmount ?? 0;
    
            setGrandTaxAmount(convertToTwoDecimalFloat(grandTaxAmount));
           
    
            setOrderTotal(convertToTwoDecimalFloat(itemTotal));
        }
        
    }, [cartAllProducts, orderLevelTaxRateType, orderLevelTaxValue]);


    //-- Do not add any dependency in array of this useEffect()
    useEffect(() => {
        // Set the default value for show_company_detail
        setValue('show_company_detail', true);

    }, []);




    // Fetch options when the search query changes
    useEffect(() => {
        if (searchQueryOrder && stringIsNullOrWhiteSpace(searchQueryOrder) == false) {
            gerPurchaseOrdersListForGrnVoucherBySearchTermService();
        } else {
            setSelectedSearchOrderOptions([]); // Clear options if search query is empty
        }
    }, [searchQueryOrder]);


    const gerPurchaseOrdersListForGrnVoucherBySearchTermService = () => {
        gerPurchaseOrdersListForGrnVoucherBySearchTermApi(searchQueryOrder)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    const orderOptions = res?.data?.map((product: any) => ({
                        value: product.purchase_order_id,
                        label: `${product.po_number} -- ${makeAnyStringShortAppenDots(product.po_reference, 40)}`
                    }));
                    setSelectedSearchOrderOptions(orderOptions);
                } else {
                    setSelectedSearchOrderOptions([]);
                }

            }).catch((error: any) => {
                console.error('Error fetching order data:', error);
            });
    };



    return (
        <>
            <Content>

                <KTCard>



                    <KTCardBody className='py-4'>

                        <form ref={formRefOrder}
                            onSubmit={(e) => {
                                handleSubmit(createPurchaseOrder)(e);
                                setFormSubmitted(true);
                            }}
                        >
                            <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                                <div className='row'>


                                    {/* <input type='hidden' id="busnPartnerIdEditForm" {...register("busnPartnerIdEditForm", { required: false })} />
                */}


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label">PO Number</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.po_number ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="po_number" {...register("po_number", { required: false })}
                                                readOnly={true}
                                                placeholder="PO Number"
                                            />
                                            {errors.po_number && <SiteErrorMessage errorMsg='PO Ref is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Receiver Name</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.receiver_name ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="receiver_name" {...register("receiver_name", { required: true })}

                                                placeholder="Enter receiver name"
                                            />
                                            {errors.receiver_name && <SiteErrorMessage errorMsg='Receiver name is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Receiver Contact</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.receiver_contact ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="receiver_contact" {...register("receiver_contact", { required: true })}

                                                placeholder="Enter receiver contact"
                                            />
                                            {errors.receiver_contact && <SiteErrorMessage errorMsg='Receiver contact is required' />}
                                        </div>
                                    </div>



                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required "> Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.grn_date ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="grn_date" {...register("grn_date", { required: true })}

                                                placeholder="Enter date"
                                            />
                                            {errors.grn_date && <SiteErrorMessage errorMsg='Date is required' />}
                                        </div>
                                    </div>



                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                       
                                            <div className="form-check mt-10">
                                                <input className="form-check-input" type="checkbox"
                                                    id="show_company_detail" {...register("show_company_detail")}
                                                />
                                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                                    Show Company Detail
                                                </label>
                                            </div>
                                            {errors.show_company_detail && <SiteErrorMessage errorMsg='Tax status is required' />}
                                        </div>
                                    </div>












                                </div>

                            </div>

                            {/* <div className='admin-modal-footer'>
          
            <button className="btn btn-danger" type='submit'>Create Order</button>
        </div> */}

                        </form>



                    </KTCardBody>
                </KTCard>





                <div
                    className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover mt-3'
                    style={{
                        backgroundColor: '#663259',
                        backgroundSize: 'auto 100%',
                        backgroundImage: `url('${toAbsoluteUrl('media/misc/taieri.svg')}')`,
                    }}
                >

                    <div className='card-body container-xxl pt-10 pb-8'>

                        <div className=' d-flex align-items-center'>
                            <h1 className='fw-bold me-3 text-white'>Search</h1>

                            <span className='fw-bold text-white opacity-50'>Orders List</span>
                        </div>



                        <div className='d-flex flex-column'>

                            <div className='d-lg-flex align-lg-items-center'>

                                <div className='rounded d-flex flex-column flex-lg-row align-items-lg-center bg-body p-5 w-xxl-550px h-lg-60px me-lg-10 my-5'>

                                    <div className='row flex-grow-1 mb-5 mb-lg-0'>

                                        <div className='col-lg-8 d-flex align-items-center mb-3 mb-lg-0'>
                                            <KTIcon iconName='magnifier' className='fs-1 text-gray-500 me-1' />

                                            {/* <input
                            type='search'
                            className='form-control form-control-flush flex-grow-1'
                            name='search'
                            // value={searchForm.product_name}
                            // onChange={e => onChange('product_name', e.target.value)}
                            placeholder='Search Product'
                        /> */}


                                            <ReactSelect
                                                isMulti={false}
                                                isClearable={true}
                                                placeholder="Search order"
                                                className="flex-grow-1"
                                                styles={customStyles}
                                                value={selectedOrderItemDropDown}
                                                onChange={handleSelectPurchaseOrderDropDown}
                                                options={selectedSearchOrderOptions}
                                                onInputChange={setSearchQueryOrder}
                                            />

                                        </div>






                                    </div>





                                </div>


                            </div>

                        </div>

                    </div>

                </div>


                <div className="card card-xl-stretch mb-5 mb-xl-8 mt-5">
                    <div className='card-header border-0'>
                        <h3 className='card-title fw-bold text-gray-900'>Selected Order Items</h3>
                        <div className='card-toolbar'>
                            {/* begin::Menu */}
                            <button
                                type='button'
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                data-kt-menu-trigger='click'
                                data-kt-menu-placement='bottom-end'
                                data-kt-menu-flip='top-end'
                            >
                                <KTIcon iconName='category' className='fs-2' />
                            </button>

                        </div>
                    </div>

                    <div className='card-body pt-0'>

                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className='table-responsive'>

                                    <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                                        <thead>
                                            <tr className='fw-bold text-muted'>

                                                <th className='min-w-50px'>Select</th>
                                                <th className='min-w-100px'>Product Name</th>
                                                <th className='min-w-80px'>SKU</th>


                                                <th className='min-w-150px'> Cost</th>

                                                <th className='min-w-100px'>Quantity</th>
                                                <th className='min-w-80px'>Amount</th>
                                                <th className='min-w-200px'>Item Tax</th>

                                                <th className='min-w-80px'>Item Total Tax</th>
                                                <th className='min-w-80px text-center'>Item Total</th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                cartAllProducts != undefined && cartAllProducts.length > 0
                                                    ?
                                                    <>
                                                        {cartAllProducts?.map((productItem: any, index: number) => (
                                                            <tr key={index}>

                                                                <td role="cell" className="ps-3">
                                                                    <div className='d-flex'>
                                                                        <input type="checkbox" checked={productItem.is_item_checked == true ? true : false}
                                                                            className="form-check-input me-2"
                                                                            onChange={(e) => handleCheckboxOrderItemChange(index, e.target.checked)}
                                                                        />

                                                                    </div>

                                                                </td>

                                                                <td role="cell" className="ps-3">
                                                                    <div className='d-flex align-items-center'>

                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                {makeAnyStringShortAppenDots(productItem?.product_name, 20)}
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td role="cell" className="">{productItem.code_sku}</td>


                                                                <td>
                                                                    <a className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                                                                        {/* {productItem?.price} */}

                                                                        <input
                                                                            className='form-select form-select-solid item-cart-price'
                                                                            type="number"
                                                                            min={1}
                                                                            readOnly={true}
                                                                            disabled={true}
                                                                            value={productItem.price || 0}


                                                                        />
                                                                    </a>

                                                                </td>

                                                                <td className='text-end '>
                                                                    <input
                                                                        className='form-select form-select-solid '
                                                                        type="number"
                                                                        min={1}
                                                                        value={productItem.quantity || 1}
                                                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}

                                                                    />
                                                                </td>
                                                                <td role="cell" className="">{calculateItemAmount(productItem.price, productItem.quantity)}</td>

                                                                <td role="cell" className="">
                                                                    <div className="tax-container">
                                                                        <select
                                                                            value={productItem.tax_rate_type ?? ''}
                                                                            onChange={(event) => handleProductTaxRateTypeChange(index, event)}
                                                                            disabled={true}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="Percentage">Percentage</option>
                                                                            <option value="Fixed">Fixed</option>

                                                                        </select>
                                                                        <input
                                                                            className='form-control'
                                                                            type="number"
                                                                            min={0}
                                                                            readOnly={true}
                                                                            value={productItem.tax_value || 0}
                                                                            onChange={(e) => hanldeProductTaxValue(index, parseInt(e.target.value, 10))}
                                                                            placeholder="Enter tax value"
                                                                        />
                                                                    </div>
                                                                </td>



                                                                <td className='text-center '>
                                                                    {calculateItemLevelTaxValueNew(productItem)}


                                                                </td>

                                                                <td className="text-center min-w-50px pe-3">{calculateOrderItemAmount(productItem)}</td>





                                                            </tr>
                                                        ))}


                                                    </>
                                                    :
                                                    <tr>
                                                        <td colSpan={10}>
                                                            <div className='d-flex p-5 justify-content-center align-content-center'>
                                                                <h4 className='text-center'>No product found</h4>
                                                            </div>
                                                        </td>


                                                    </tr>
                                            }

                                        </tbody>
                                        {
                                            cartAllProducts != undefined && cartAllProducts.length > 0
                                                ?
                                                <tfoot className=''>
                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end'></td>
                                                        <td ></td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Sub Total</td>
                                                        <td id="subTotal">{cartItemTotlal}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Tax</td>
                                                        <td className='min-w-250px'>

                                                            <div className='order-tax-box'>
                                                                <div className="tax-container">
                                                                    <select
                                                                        value={orderLevelTaxRateType}
                                                                        onChange={(e) => setOrderLevelTaxRateType(e.target.value)}
                                                                        disabled={true}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        <option value="Percentage">Percentage</option>
                                                                        <option value="Fixed">Fixed</option>

                                                                    </select>
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        value={orderLevelTaxValue || 0}
                                                                        readOnly={true}
                                                                        onChange={(e) => setOrderLevelTaxValue(parseInt(e.target.value, 10))}
                                                                        placeholder="Enter tax value"
                                                                    />
                                                                </div>

                                                                <div className='mt-2'>
                                                                    Total: {calculateTaxValueNewFunc(cartItemTotlal, orderLevelTaxRateType, orderLevelTaxValue)}
                                                                </div>
                                                            </div>








                                                        </td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Total Tax</td>
                                                        <td id="subTotal">{grandTaxAmount}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={8} className='text-end fw-bold'>Grand Total</td>
                                                        <td id="subTotal">{orderTotal}</td>
                                                    </tr>
                                                </tfoot>
                                                :
                                                <>
                                                </>
                                        }
                                    </table>

                                </div>

                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-end align-content-center">
                                    <button className="btn btn-primary fs-3"
                                        onClick={() => {
                                            if (formRefOrder.current) {
                                                formRefOrder.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} /> Save
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>

                </div>

                {
                    isOpenReceiptModal == true
                        ?

                        <GrnVoucherReceiptModal
                            isOpen={isOpenReceiptModal}
                            closeModal={handleOpenCloseOrderReceiptModal}
                            voucherId={latestGrnVoucherId}
                        />
                        :
                        <>
                        </> 
                }


            </Content>
        </>
    )
}
