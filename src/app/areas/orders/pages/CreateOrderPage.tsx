/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { createPurchaseOrderApi, gerProductsListBySearchTermApi, getAllUsersApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from 'react-select';
import { showErrorMsg, showSuccessMsg, showWarningMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { OrderTaxStatusEnum, taxRulesTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { calculateItemAmount, calculateItemLevelTaxValueNew, calculateItemsSubTotal, calculateOrderItemAmount, calculateTaxValue, calculateTaxValueNewFunc, getTaxRateByTaxRuleId } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import { useNavigate } from 'react-router';
import PurchaseOrderReceiptModal from '../components/PurchaseOrderReceiptModal';


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

export default function CreateOrderPage() {
    const navigate = useNavigate();
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);


    const [allVendorsList, setAllVendorsList] = useState<any>(null);

    const [allSaleRepresentativesList, setAllSaleRepresentativesList] = useState<any>(null);
    const [minDate, setMinDate] = useState('');
    const [cartAllProducts, setCartAllProducts] = useState<any>([]);
    const [searchQueryProduct, setSearchQueryProduct] = useState('');
    const [selectedSearchProductOptions, setSelectedSearchProductOptions] = useState([]);
    const [selectedProductDropDown, setSelectedProductDropDown] = useState<any>(null);

    const [orderTaxStatusLocal, setOrderTaxStatusLocal] = useState<any>(OrderTaxStatusEnum.Taxable);

    const [cartItemTotlal, setCartItemTotlal] = useState<number>(0);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [grandTaxAmount, setGrandTaxAmount] = useState<number>(0);

    const [orderLevelTaxRateType, setOrderLevelTaxRateType] = useState<any>(null);
    const [orderLevelTaxValue, setOrderLevelTaxValue] = useState<any>(0);
    const [orderLevelTaxFinalAmount, setOrderLevelTaxFinalAmount] = useState<number>(0);

    const [latestOrderId, setLatestOrderId] = useState<any>(0);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }



    const createPurchaseOrder = (data: any) => {

        const { po_reference, delivery_date, company_name, order_date, vendor_id, sale_representative_id, purchaser_name, payment_terms, remarks, order_tax_status } = data;
        if (stringIsNullOrWhiteSpace(po_reference) || stringIsNullOrWhiteSpace(delivery_date)
            || stringIsNullOrWhiteSpace(company_name) || stringIsNullOrWhiteSpace(order_date) || stringIsNullOrWhiteSpace(vendor_id)
            || stringIsNullOrWhiteSpace(sale_representative_id) || stringIsNullOrWhiteSpace(purchaser_name)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        let cartProductsLocal: any = []


  
        
        cartAllProducts?.forEach((item: any) => {

            // let taxRateItem = getTaxRateByTaxRuleId(allTaxRules, item?.product_tax_rule_id);
            // let itemTotalTax = calculateTaxValue(taxRateItem, item?.price);



            cartProductsLocal.push({
                productid: item.productid,
                quantity: item.quantity ?? 1,
                price: item?.price,

                tax_rate_type: item?.tax_rate_type,
                tax_value: item.tax_value,
                itemTotalTax: item.itemTotalTax,

                itemTotal: item?.itemTotal,
            })
        });


        let formData = {
            po_reference: po_reference,
            delivery_date: delivery_date,
            company_name: company_name,
            order_date: order_date,
            vendor_id: vendor_id,
            sale_representative_id: sale_representative_id,
            purchaser_name: purchaser_name,
            payment_terms: payment_terms,
            remarks: remarks,
            order_tax_status: order_tax_status ?? OrderTaxStatusEnum.Taxable,


            cartAllProducts: cartProductsLocal,

            orderTotal: orderTotal,

            orderLevelTaxRateType: orderLevelTaxRateType,
            orderLevelTaxValue: orderLevelTaxValue,
            orderLevelTaxAmount: orderLevelTaxFinalAmount,


        }

        createPurchaseOrderApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");

                    setCartAllProducts([]);
                    setLatestOrderId(res?.data?.response?.primaryKeyValue);


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

        // reset(); // Clear the form after submission
    };

    const handleSelectProductDropDown = (selectedOption: any) => {
        // Set the selected customer state

        setSelectedProductDropDown(null);

        const productidSelected = selectedOption?.value;

        const productExists = cartAllProducts.some((item: { productid: any; }) => item.productid == productidSelected);
        if (productExists) {
            showWarningMsg('Product already added in the list');
            return false;
        }



        getProductDetailById(productidSelected)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    setCartAllProducts((prevCart: any) => [...prevCart, data]);
                }


            })
            .catch((err: any) => console.log(err, "err"));


        // setSelectedCustomerObject(allCustomers?.find((x: { busnPartnerId: any; }) => x.busnPartnerId == selectedOption?.value));
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        setCartAllProducts((prevCart: any) => {
            const updatedCart = [...prevCart];
            updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
            return updatedCart;
        });
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

    const hanldeProductPriceChange = (index: number, value: number) => {
        setCartAllProducts((prevProducts: any) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].price = value;
            return updatedProducts;
        });
    };



    const removeProductFromCart = (e: any, productid: number) => {
        e.preventDefault();
        setCartAllProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));
    };




    const setMinDeliveryDate = () => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }

    useEffect(() => {
        let itemTotal = calculateItemsSubTotal(cartAllProducts);
        setCartItemTotlal(itemTotal);
        
        let orderLevelTaxValueLocal = 0;
        if (orderLevelTaxRateType && !stringIsNullOrWhiteSpace(orderLevelTaxRateType)) {
            orderLevelTaxValueLocal = calculateTaxValueNewFunc(itemTotal, orderLevelTaxRateType, (orderLevelTaxValue ?? 0));

            itemTotal = itemTotal + orderLevelTaxValueLocal;
            setOrderLevelTaxFinalAmount(orderLevelTaxValueLocal);
        }

        //--calcualte all taxes (product level + order level)
        let itemsGrandTotalTax = cartAllProducts?.reduce((total: any, product: any) => total + product.itemTotalTax, 0);
        let grandTaxAmount = (orderLevelTaxValueLocal + (parseInt(itemsGrandTotalTax?.toFixed(2) ?? 0)))?.toFixed(2);

        setGrandTaxAmount(parseFloat(grandTaxAmount ?? "0"));

        setOrderTotal(itemTotal);
    }, [cartAllProducts, orderLevelTaxRateType, orderLevelTaxValue]);


    useEffect(() => {
        setMinDeliveryDate();
        getAllVendorsListService();
        getAllSaleRepresentativesListService();

    }, []);

    const getAllVendorsListService = () => {

        const pageBasicInfoAllVendors: any = {
            pageNo: 1,
            pageSize: 600
        }
        let pageBasicInfoVendorRequestParams = new URLSearchParams(pageBasicInfoAllVendors).toString();
        pageBasicInfoVendorRequestParams = `${pageBasicInfoVendorRequestParams}&busnPartnerTypeId=${BusinessPartnerTypesEnum.Vendor}`;



        getAllUsersApi(pageBasicInfoVendorRequestParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllVendorsList(res?.data);
                } else {
                    setAllVendorsList([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const getAllSaleRepresentativesListService = () => {

        const pageBasicInfoAllSaleRepresentatives: any = {
            pageNo: 1,
            pageSize: 600
        }
        let pageBasicInfoSaleRepresentativesequestParams = new URLSearchParams(pageBasicInfoAllSaleRepresentatives).toString();
        pageBasicInfoSaleRepresentativesequestParams = `${pageBasicInfoSaleRepresentativesequestParams}&busnPartnerTypeId=${BusinessPartnerTypesEnum.SalesRepresentative}`;



        getAllUsersApi(pageBasicInfoSaleRepresentativesequestParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllSaleRepresentativesList(res?.data);
                } else {
                    setAllSaleRepresentativesList([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };




    // Fetch options when the search query changes
    useEffect(() => {
        if (searchQueryProduct && stringIsNullOrWhiteSpace(searchQueryProduct) == false) {
            gerProductsListBySearchTermService();
        } else {
            setSelectedSearchProductOptions([]); // Clear options if search query is empty
        }
    }, [searchQueryProduct]);


    //--if new user added from form then will pass searchByCustomerId to this funtion
    const gerProductsListBySearchTermService = () => {
        gerProductsListBySearchTermApi(searchQueryProduct)
            .then((res: any) => {
                const { data } = res;

                if (data && data != undefined && data != null) {
                    const customerOptions = res?.data?.map((product: any) => ({
                        value: product.productid,
                        label: `${product.sku} -- ${makeAnyStringShortAppenDots(product.product_name, 40)}`
                    }));
                    setSelectedSearchProductOptions(customerOptions);
                } else {
                    setSelectedSearchProductOptions([]);
                }

            }).catch((error: any) => {
                console.error('Error fetching product data:', error);
            });
    };

    useEffect(() => {
        // Set the default value for order_tax_status
        setValue('order_tax_status', OrderTaxStatusEnum.Taxable);
    }, []);

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Create Order'
                pageDescription='Create Order'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

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
                                            <label className="form-label required ">PO Reference</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.po_reference ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="po_reference" {...register("po_reference", { required: true })}

                                                placeholder="Enter PO reference"
                                            />
                                            {errors.po_reference && <SiteErrorMessage errorMsg='PO Ref is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Delivery Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.delivery_date ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="delivery_date" {...register("delivery_date", { required: true })}
                                                min={minDate} // Set the minimum date
                                                placeholder="Enter delivery date"
                                            />
                                            {errors.delivery_date && <SiteErrorMessage errorMsg='Delivery date is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Company Name</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.company_name ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="company_name" {...register("company_name", { required: true })}

                                                placeholder="Enter company name"
                                            />
                                            {errors.company_name && <SiteErrorMessage errorMsg='Company name is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required "> Date</label>
                                            <input
                                                type="date"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.order_date ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="order_date" {...register("order_date", { required: true })}

                                                placeholder="Enter date"
                                            />
                                            {errors.order_date && <SiteErrorMessage errorMsg='Date is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required">Vendor </label>
                                            <select
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.vendor_id ? 'is-invalid' : 'is-valid') : ''}`}

                                                aria-label="Select example"
                                                id="vendor_id" {...register("vendor_id", { required: true })}
                                            >
                                                <option value=''>--Select--</option>

                                                {allVendorsList?.map((item: any, index: any) => (
                                                    <option key={index} value={item.busnPartnerId}>
                                                        {item.firstName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.vendor_id && <SiteErrorMessage errorMsg='Vendor is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label">Sales Representative </label>
                                            <select
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.sale_representative_id ? 'is-invalid' : 'is-valid') : ''}`}

                                                aria-label="Select example"
                                                id="sale_representative_id" {...register("sale_representative_id", { required: false })}
                                            >
                                                <option value=''>--Select--</option>

                                                {allSaleRepresentativesList?.map((item: any, index: any) => (
                                                    <option key={index} value={item.busnPartnerId}>
                                                        {item.firstName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.sale_representative_id && <SiteErrorMessage errorMsg='Sale representative is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Purchaser Name</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.purchaser_name ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="purchaser_name" {...register("purchaser_name", { required: true })}

                                                placeholder="Enter purchaser name"
                                            />
                                            {errors.purchaser_name && <SiteErrorMessage errorMsg='Purchaser name is required' />}
                                        </div>
                                    </div>


                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Payment Terms</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.payment_terms ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="payment_terms" {...register("payment_terms", { required: true })}

                                                placeholder="Enter payment terms"
                                            />
                                            {errors.payment_terms && <SiteErrorMessage errorMsg='Payment terms are required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Remarks</label>
                                            <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.remarks ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="remarks" {...register("remarks", { required: true })}

                                                placeholder="Enter remarks"
                                            />
                                            {errors.remarks && <SiteErrorMessage errorMsg='Remarks is required' />}
                                        </div>
                                    </div>



                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required">Order Tax Status </label>
                                            <select
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.order_tax_status ? 'is-invalid' : 'is-valid') : ''}`}

                                                aria-label="Select example"
                                                id="order_tax_status" {...register("order_tax_status", { required: true })}
                                                onChange={(e)=>setOrderTaxStatusLocal(e.target.value)}
                                            >

                                                <option value='1'>Taxable</option>
                                                <option value='2'>Non-Taxable</option>

                                            </select>
                                            {errors.order_tax_status && <SiteErrorMessage errorMsg='Tax status is required' />}
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

                            <span className='fw-bold text-white opacity-50'>Products List</span>
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
                                                placeholder="Search product"
                                                className="flex-grow-1"
                                                styles={customStyles}
                                                value={selectedProductDropDown}
                                                onChange={handleSelectProductDropDown}
                                                options={selectedSearchProductOptions}
                                                onInputChange={setSearchQueryProduct}
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
                        <h3 className='card-title fw-bold text-gray-900'>Selected Products</h3>
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

                                                <th className='min-w-80px'>Product Id</th>
                                                <th className='min-w-100px'>Product Name</th>
                                                <th className='min-w-80px'>SKU</th>
                                                <th className='min-w-150px'> Cost</th>

                                                <th className='min-w-100px'>Quantity</th>
                                                <th className='min-w-80px'>Amount</th>
                                                <th className='min-w-200px'>Item Tax</th>

                                                <th className='min-w-80px'>Item Total Tax</th>
                                                <th className='min-w-80px text-center'>Item Total</th>
                                                <th className='min-w-50px text-start'>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                cartAllProducts != undefined && cartAllProducts.length > 0
                                                    ?
                                                    <>
                                                        {cartAllProducts?.map((productItem: any, index: number) => (
                                                            <tr key={index}>
                                                                <td role="cell" className="ps-3">{productItem.productid}</td>


                                                                <td>
                                                                    <div className='d-flex align-items-center'>

                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                {makeAnyStringShortAppenDots(productItem?.product_name, 20)}
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td role="cell" className="">{productItem.sku}</td>

                                                                <td>
                                                                    <a className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                                                                        {/* {productItem?.price} */}

                                                                        <input
                                                                            className='form-select form-select-solid item-cart-price'
                                                                            type="number"
                                                                            min={1}
                                                                            value={productItem.price || 0}
                                                                            onChange={(e) => hanldeProductPriceChange(index, parseInt(e.target.value, 10))}

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
                                                                            disabled={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="Percentage">Percentage</option>
                                                                            <option value="Fixed">Fixed</option>

                                                                        </select>
                                                                        <input
                                                                            className='form-control'
                                                                            type="number"
                                                                            min={0}
                                                                            readOnly={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
                                                                            value={productItem.tax_value || 0}
                                                                            onChange={(e) => hanldeProductTaxValue(index, parseInt(e.target.value, 10))}
                                                                            placeholder="Enter tax value"
                                                                        />
                                                                    </div>
                                                                </td>



                                                                <td className='text-center '>
                                                                    {calculateItemLevelTaxValueNew(productItem)}


                                                                </td>

                                                                <td className="text-center">{calculateOrderItemAmount(productItem)}</td>



                                                                <td className='text-center min-w-50px pe-3'>
                                                                    <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                                        onClick={(e) => removeProductFromCart(e, productItem?.productid)}
                                                                    >
                                                                        <i className="ki-duotone ki-trash fs-2">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </a>
                                                                </td>

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
                                                                        disabled={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
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
                                                                        readOnly={orderTaxStatusLocal == OrderTaxStatusEnum.Taxable ? false : true}
                                                                        onChange={(e) => setOrderLevelTaxValue(parseInt(e.target.value, 10))}
                                                                        placeholder="Enter tax value"
                                                                    />
                                                                </div>

                                                                <div className='mt-2'>
                                                                    Total: {calculateTaxValueNewFunc(cartItemTotlal  , orderLevelTaxRateType, orderLevelTaxValue)}
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

                        <PurchaseOrderReceiptModal
                            isOpen={isOpenReceiptModal}
                            closeModal={handleOpenCloseOrderReceiptModal}
                            orderId={latestOrderId}
                        />
                        :
                        <>
                        </>
                }

            </Content>
        </AdminLayout>
    )
}
