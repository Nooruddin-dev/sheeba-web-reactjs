/* eslint-disable */

import { useEffect, useRef, useState } from 'react'
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import { useForm } from 'react-hook-form';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { createPurchaseOrderApi, gerProductsListBySearchTermApi, getAllUsersApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from 'react-select';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppendDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { ProductTypeEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { calculatePurchaseOrderLineItem, calculatePurchaseOrderCartSummary } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import PurchaseOrderReceiptModal from '../components/PurchaseOrderReceiptModal';
import { generateUniqueIdWithDate } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { formatNumber } from '../../common/util';


const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
    }),
};

export default function CreatePurchaseOrderSub(props: { orderDetailForEditClone: any, isEditCloneCase: boolean }) {
    const { orderDetailForEditClone, isEditCloneCase } = props;
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [allVendorsList, setAllVendorsList] = useState<any>(null);
    const [allSaleRepresentativesList, setAllSaleRepresentativesList] = useState<any>(null);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [cartProducts, setCartProducts] = useState<any>([]);
    const [cartSummary, setCartSummary] = useState<any>({});
    const [searchQueryProduct, setSearchQueryProduct] = useState('');
    const [selectedSearchProductOptions, setSelectedSearchProductOptions] = useState([]);
    const [selectedProductDropDown, setSelectedProductDropDown] = useState<any>(null);
    const [latestOrderId, setLatestOrderId] = useState<any>(0);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    const print = () => {
        setIsOpenReceiptModal(true);
    };

    const createPurchaseOrder = (data: any) => {
        const { po_reference, delivery_date, company_name, order_date, vendor_id, sale_representative_id, purchaser_name, payment_terms, remarks, show_company_detail } = data;
        if (stringIsNullOrWhiteSpace(po_reference) || stringIsNullOrWhiteSpace(delivery_date)
            || stringIsNullOrWhiteSpace(company_name) || stringIsNullOrWhiteSpace(order_date) || stringIsNullOrWhiteSpace(vendor_id)
            || stringIsNullOrWhiteSpace(sale_representative_id) || stringIsNullOrWhiteSpace(purchaser_name)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (cartProducts == undefined || cartProducts == null || cartProducts.length < 1) {
            showErrorMsg('Please add product');
            return false;
        }

        const weightlessProduct = cartProducts.find((product: any) => !product.weight);
        if (weightlessProduct) {
            showErrorMsg(weightlessProduct.product_name + ' weight is required');
            return false;
        }

        const pricelessProduct = cartProducts.find((product: any) => !product.price);
        if (pricelessProduct) {
            showErrorMsg(pricelessProduct.product_name + ' cost is required');
            return false;
        }

        let lineItems: any = []
        cartProducts?.forEach((item: any) => {
            lineItems.push({
                product_id: item.productid,
                weight: item.weight,
                price: item?.price,
                product_units_info: item?.product_units_info,
                subtotal: item.subtotal,
                discount: item.discount || 0,
                tax_1_percentage: item.tax_1_percentage || 0,
                tax_1_amount: item.tax_1_amount,
                tax_2_percentage: item.tax_2_percentage || 0,
                tax_2_amount: item.tax_2_amount,
                tax_3_percentage: item.tax_3_percentage || 0,
                tax_3_amount: item.tax_3_amount,
                total_tax: item.total_tax,
                total: item.total,
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
            show_company_detail: show_company_detail ?? true,
            products: lineItems,
            order_subtotal: cartSummary.subtotal,
            order_tax_percentage: cartSummary.tax_percentage || 0,
            order_tax_amount: cartSummary.tax_amount,
            order_discount: cartSummary.discount || 0,
            order_total_discount: cartSummary.total_discount,
            order_total_tax: cartSummary.total_tax,
            order_total: cartSummary.total,
        }

        createPurchaseOrderApi(formData)
            .then((res: any) => {
                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    setCartProducts([]);
                    setLatestOrderId(res?.data?.response?.primaryKeyValue);
                    print();
                    reset();
                    setFormSubmitted(false);
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

    const handleSelectProductDropDown = (selectedOption: any) => {
        setSelectedProductDropDown(null);
        const productIdSelected = selectedOption?.value;
        const productAlreadyInCart = cartProducts.some((product: any) => product.productid === productIdSelected);
        if (productAlreadyInCart) {
            showErrorMsg("Product is already added to this purchase order");
            return;
        }
        getProductDetailById(productIdSelected)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    data.unique_id = generateUniqueIdWithDate();
                    data.price = 0;
                    data.weight = 0;
                    data.tax_1_percentage = 0;
                    data.tax_2_percentage = 0;
                    data.tax_3_percentage = 0;
                    data.discount = 0;
                    if (data.product_latest_purchase_order_item && data.product_latest_purchase_order_item.po_rate &&
                        data.product_latest_purchase_order_item.po_rate > 0) {
                        data.price = data.product_latest_purchase_order_item.po_rate;
                    }
                    setCartProducts((prevCart: any) => {
                        const product = calculatePurchaseOrderLineItem(data);
                        return [...prevCart, product]
                    });
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const handleLineItemChange = (index: number, key: string, value: number) => {
        setCartProducts((prevProducts: any) => {
            const products = [...prevProducts];
            products[index] = { ...products[index], [key]: value ?? 0 };
            const updatedProduct = calculatePurchaseOrderLineItem(products[index])
            products[index] = { ...products[index], ...updatedProduct };
            return products;
        });

    };

    const handleCartTaxChange = (value: number) => {
        setCartSummary((prevCart: any) => {
            return { ...calculatePurchaseOrderCartSummary(prevCart, cartProducts, value) };
        });
    }

    const handleCartDiscountChange = (value: number) => {
        setCartSummary((prevCart: any) => {
            return { ...calculatePurchaseOrderCartSummary(prevCart, cartProducts, undefined, value) };
        });
    }

    const removeProductFromCart = (e: any, productid: number) => {
        e.preventDefault();
        setCartProducts((prevProducts: any) => prevProducts.filter((product: { productid: number; }) => product.productid !== productid));
    };


    const setMinDeliveryDate = () => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }

    const setMaxOrderDate = () => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        setMaxDate(`${yyyy}-${mm}-${dd}`);
    }

    useEffect(() => {
        setCartSummary((prevCart: any) => {
            return { ...calculatePurchaseOrderCartSummary(prevCart, cartProducts, prevCart.tax_percentage) };
        });
    }, [cartProducts]);

    useEffect(() => {
        setMinDeliveryDate();
        setMaxOrderDate();
        getAllVendorsListService();
        getAllSaleRepresentativesListService();
        setCartSummary({
            subtotal: 0,
            total_line_item_discount: 0,
            total_line_item_tax: 0,
            discount: 0,
            tax_percentage: 0,
            tax_amount: 0,
            total_discount: 0,
            total_tax: 0,
            total: 0,
        })

        // Set the default value for show_company_detail
        setValue('show_company_detail', true);

        //-- if edit clone case, then do perform operation in below setTimeout block
        setTimeout(async () => {
            if (isEditCloneCase == true) {
                setValue('po_reference', orderDetailForEditClone.po_reference);
                setValue('company_name', orderDetailForEditClone.company_name);
                setValue('vendor_id', orderDetailForEditClone.vendor_id);
                setValue('sale_representative_id', orderDetailForEditClone.sale_representative_id);
                setValue('purchaser_name', orderDetailForEditClone.purchaser_name);
                setValue('payment_terms', orderDetailForEditClone.payment_terms);
                setValue('remarks', orderDetailForEditClone.remarks);

                //-- get all products for that order and set in setCartProducts
                if (orderDetailForEditClone.order_items && orderDetailForEditClone.order_items.length > 0) {
                    try {
                        const promises = orderDetailForEditClone.order_items.map((orderItem: any) =>
                            getProductDetailById(orderItem.product_id).then((res) => {
                                const { data } = res;
                                if (data) {
                                    data.unique_id = generateUniqueIdWithDate();
                                    data.price = parseFloat(orderItem.po_rate);
                                    data.weight = parseFloat(orderItem.weight);
                                    data.discount = parseFloat(orderItem.discount);
                                    data.tax_1_percentage = parseFloat(orderItem.tax_1_percentage);
                                    data.tax_2_percentage = parseFloat(orderItem.tax_2_percentage);
                                    data.tax_3_percentage = parseFloat(orderItem.tax_3_percentage);
                                }
                                return data;
                            })
                        );

                        const results = await Promise.all(promises);
                        const validResults = results?.filter((data) => data !== undefined);
                        setCartProducts(() => {
                            const cartProducts = validResults.map((result) => calculatePurchaseOrderLineItem(result));
                            setCartSummary(() => {
                                const summary = calculatePurchaseOrderCartSummary({}, cartProducts, parseFloat(orderDetailForEditClone.order_discount), parseFloat(orderDetailForEditClone.order_tax_percentage));
                                return summary;
                            });
                            return cartProducts;
                        });
                    } catch (error) {
                        console.error("Error fetching product details", error);
                    }
                }
            }
        }, 1000);

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
                        label: `${product.sku} -- ${makeAnyStringShortAppendDots(product.product_name, 40)}`
                    }));
                    setSelectedSearchProductOptions(customerOptions);
                } else {
                    setSelectedSearchProductOptions([]);
                }

            }).catch((error: any) => {
                console.error('Error fetching product data:', error);
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
                                                max={maxDate}
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
                                                id="vendor_id" {...register("vendor_id", { required: true })}>
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
                                            <div className="form-check">
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
                        </form>
                    </KTCardBody>
                </KTCard>





                <div
                    className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover mt-3 bgclor'
                    style={{

                        backgroundSize: 'auto 100%',

                    }}
                >

                    <div className='card-body container-xxl pt-10 pb-8'>

                        <div className=' d-flex align-items-center'>
                            <h1 className='fw-bold me-3'>Search</h1>

                            <span className='fw-bold'>Products List</span>
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
                                                <th className='min-w-80px text-start'>SKU</th>
                                                <th className='min-w-200px text-start'>Product Name</th>
                                                <th className='min-w-150px'>Cost</th>
                                                <th className='min-w-150px'>Weight</th>
                                                <th className='min-w-80px'>Unit</th>
                                                <th className='min-w-150px'>Subtotal</th>
                                                <th className='min-w-150px'>Discount</th>
                                                <th className='min-w-150px'>Sales Tax %</th>
                                                <th className='min-w-150px'>Further Tax %</th>
                                                <th className='min-w-150px'>Advance Tax %</th>
                                                <th className='min-w-150px'>Total Tax</th>
                                                <th className='min-w-150px'>Total</th>
                                                <th className='min-w-50px'></th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                cartProducts != undefined && cartProducts.length > 0
                                                    ?
                                                    <>
                                                        {cartProducts?.map((productItem: any, index: number) => (
                                                            <tr key={index}>
                                                                <td role="cell">{productItem.sku}</td>
                                                                <td role="cell" className="ps-3">
                                                                    <div>
                                                                        <b>{productItem?.product_name}</b>
                                                                    </div>
                                                                    <div>
                                                                        {productItem.product_units_info && productItem.product_units_info.length > 0 ? (
                                                                            <div className='d-flex flex-column' style={{ maxHeight: "100px", overflow: "auto" }}>
                                                                                {
                                                                                    productItem.product_units_info
                                                                                        ?.filter((x: { unit_type: any; }) => x.unit_type == ProductTypeEnum.Roll)
                                                                                        ?.map((productUnit: any, unitIndex: number) => (
                                                                                            <div key={unitIndex} className="d-flex justify-content-between align-items-center">
                                                                                                <i>{productUnit.unit_sub_type}: {productUnit.unit_value} {productUnit.unit_short_name ?? ''}</i>
                                                                                            </div>
                                                                                        ))
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                {/* Handle other unit types here */}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={1}
                                                                        step="0.01"
                                                                        value={productItem.price}
                                                                        onChange={(e) => handleLineItemChange(index, 'price', parseFloat(e.target.value))}
                                                                    />
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={1}
                                                                        step="0.01"
                                                                        value={productItem.weight}
                                                                        onChange={(e) => handleLineItemChange(index, 'weight', parseFloat(e.target.value))}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <span>{productItem.unit_short_name}</span>
                                                                </td>
                                                                <td role="cell">
                                                                    {productItem?.subtotal?.toFixed(2) || 0}
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        step="0.01"
                                                                        value={productItem.discount}
                                                                        onChange={(e) => handleLineItemChange(index, 'discount', parseFloat(e.target.value))}
                                                                    />
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        step="0.01"
                                                                        value={productItem.tax_1_percentage}
                                                                        onChange={(e) => handleLineItemChange(index, 'tax_1_percentage', parseFloat(e.target.value))}
                                                                    />
                                                                    <span>({formatNumber(productItem.tax_1_amount, 2)})</span>
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        step="0.01"
                                                                        value={productItem.tax_2_percentage}
                                                                        onChange={(e) => handleLineItemChange(index, 'tax_2_percentage', parseFloat(e.target.value))}
                                                                    />
                                                                    <span>({formatNumber(productItem.tax_2_amount, 2)})</span>
                                                                </td>
                                                                <td role="cell">
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        min={0}
                                                                        step="0.01"
                                                                        value={productItem.tax_3_percentage}
                                                                        onChange={(e) => handleLineItemChange(index, 'tax_3_percentage', parseFloat(e.target.value))}
                                                                    />
                                                                    <span>({formatNumber(productItem.tax_3_amount, 2)})</span>
                                                                </td>
                                                                <td role="cell">
                                                                    {productItem?.total_tax?.toFixed(2) || 0}
                                                                </td>
                                                                <td role="cell">{productItem?.total?.toFixed(2) || 0}</td>
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
                                            cartProducts != undefined && cartProducts.length > 0
                                                ?
                                                <tfoot className=''>
                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={2} className='text-end'></td>
                                                        <td ></td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={2} className=' fw-bold'>Subtotal</td>
                                                        <td id="subTotal">{cartSummary.subtotal?.toFixed(2)}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={2} className=' fw-bold'>Discount</td>
                                                        <td className='min-w-150px'>
                                                            <input
                                                                className='form-control'
                                                                type="number"
                                                                min={0}
                                                                step="0.01"
                                                                value={cartSummary.discount}
                                                                onChange={(e) => handleCartDiscountChange(parseFloat(e.target.value))}
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={2} className=' fw-bold'>Tax %</td>
                                                        <td className='min-w-150px'>
                                                            <input
                                                                className='form-control'
                                                                type="number"
                                                                min={0}
                                                                step="0.01"
                                                                value={cartSummary.tax_percentage}
                                                                onChange={(e) => handleCartTaxChange(parseFloat(e.target.value))}
                                                            />
                                                            ({cartSummary.tax_amount?.toFixed(2)})
                                                        </td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={2} className='fw-bold'>Total Discount</td>
                                                        <td id="subTotal">{cartSummary.total_discount?.toFixed(2)}</td>
                                                    </tr>

                                                    <tr className='mt-3 border-none'>
                                                        <td colSpan={2} className='fw-bold'>Total Tax</td>
                                                        <td id="subTotal">{cartSummary.total_tax?.toFixed(2)}</td>
                                                    </tr>

                                                    <tr className='border-none'>
                                                        <td colSpan={2} className=' fw-bold'>Total</td>
                                                        <td id="subTotal">{cartSummary.total?.toFixed(2)}</td>
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
                                <div className="d-flex justify-content-start align-content-center">
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

            </Content>
            {
                isOpenReceiptModal == true
                    ?
                    <PurchaseOrderReceiptModal
                        afterPrint={setIsOpenReceiptModal}
                        data={undefined}
                        orderId={latestOrderId}
                    />
                    :
                    <>
                    </>
            }
        </>
    )
}
