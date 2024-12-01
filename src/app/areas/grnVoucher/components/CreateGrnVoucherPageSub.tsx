import React, { useEffect, useRef, useState } from 'react'
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { useForm } from 'react-hook-form';
import { createGrnVoucherApi, gerPurchaseOrdersListForGrnVoucherBySearchTermApi, getPurchaseOrderDetailsForGrnVoucherApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { makeAnyStringShortAppendDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import ReactSelect from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import GrnVoucherReceiptModal from './GrnVoucherReceiptModal';

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none'
    }),
};


export default function CreateGrnVoucherPageSub() {
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [purchaseOrderId, setPurchaseOrderId] = useState<any>(null);
    const [latestGrnVoucherId, setLatestGrnVoucherId] = useState<any>(0);
    const [selectedOrderItemDropDown, setSelectedOrderItemDropDown] = useState<any>(null);
    const [searchQueryOrder, setSearchQueryOrder] = useState('');
    const [selectedSearchOrderOptions, setSelectedSearchOrderOptions] = useState([]);

    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);
    const [cartProducts, setCartProducts] = useState<any[]>([]);
    const [cartSummary, setCartSummary] = useState<any>({});

    useEffect(() => {
        setValue('show_company_detail', true);
    }, []);

    useEffect(() => {
        setCartSummary(calculateCartSummary());
    }, [cartProducts]);


    useEffect(() => {
        if (searchQueryOrder && stringIsNullOrWhiteSpace(searchQueryOrder) == false) {
            getPurchaseOrderList();
        } else {
            setSelectedSearchOrderOptions([]);
        }
    }, [searchQueryOrder]);

    const calculateLineItem = (item: any) => {
        item.total = item.costInclusive * item.weight;
        return { ...item };
    }

    const calculateCartSummary = () => {
        let totalCostExclusive = 0;
        let totalCostInclusive = 0;
        cartProducts.forEach((item: any) => {
            if (item.isSelected) {
                totalCostExclusive += (item.cost * (item.weight || 0));
                totalCostInclusive += (item.costInclusive * (item.weight || 0))
            }
        });

        return { total: totalCostInclusive, subtotal: totalCostExclusive, }
    }

    const handleSelectPurchaseOrder = (selectedOption: any) => {
        setSelectedOrderItemDropDown(null);
        setCartProducts([])
        const purchaseOrderId = selectedOption.value;
        getPurchaseOrderDetailsForGrnVoucherApi(purchaseOrderId)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    setPurchaseOrderId(purchaseOrderId);
                    setValue('po_number', data.po_number);
                    if (data?.purchase_orders_items && data?.purchase_orders_items.length > 0) {
                        const lineItems = []
                        const orderLevelTaxAndDiscount = parseFloat(data.order_tax_amount) - parseFloat(data.order_discount);
                        const perUnitOrderLevelTaxAndDiscount = orderLevelTaxAndDiscount / data?.purchase_orders_items.length;
                        for (const item of data?.purchase_orders_items) {
                            const lineItem = {
                                isSelected: true,
                                productId: item.product_id,
                                orderLineItemId: item.line_item_id,
                                productName: item.product_name,
                                sku: item.code_sku,
                                weight: parseFloat(item.weight),
                                remainingWeight: parseFloat(item.remaining_weight),
                                cost: parseFloat(item.po_rate),
                                poTotal: parseFloat(item.total),
                                costInclusive: ((parseFloat(item.total) + perUnitOrderLevelTaxAndDiscount)) / parseFloat(item.weight),
                                quantity: 0,
                                total: 0,
                            };
                            lineItems.push(calculateLineItem(lineItem));
                        }
                        setCartProducts(lineItems);
                    }
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };

    const getPurchaseOrderList = () => {
        gerPurchaseOrdersListForGrnVoucherBySearchTermApi(searchQueryOrder)
            .then((res: any) => {
                const { data } = res;
                if (data && data !== undefined && data !== null) {
                    const orderOptions = res?.data?.map((product: any) => ({
                        value: product.purchase_order_id,
                        label: `${product.po_number} -- ${makeAnyStringShortAppendDots(product.po_reference, 40)}`
                    }));
                    setSelectedSearchOrderOptions(orderOptions);
                } else {
                    setSelectedSearchOrderOptions([]);
                }
            }).catch((error: any) => {
                console.error('error fetching order data:', error);
            });
    };

    const handleLineItemChange = (index: number, key: string, value: any) => {
        cartProducts[index][key] = value;
        cartProducts[index] = calculateLineItem(cartProducts[index]);
        setCartProducts([...cartProducts]);
    }

    const handlePrint = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }

    const handleSave = (data: any) => {
        const { po_number, receiver_name, receiver_contact, grn_date, show_company_detail } = data;
        if (stringIsNullOrWhiteSpace(po_number) || stringIsNullOrWhiteSpace(receiver_name) || stringIsNullOrWhiteSpace(receiver_contact)
            || stringIsNullOrWhiteSpace(grn_date)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (!cartProducts || cartProducts.length < 1) {
            showErrorMsg('No product found, please select correct purchase order!');
            return false;
        }

        let selectedProducts = cartProducts?.filter((x: { isSelected: boolean; }) => x.isSelected);
        if (!selectedProducts || selectedProducts.length < 1) {
            showErrorMsg('Please select at least one product!');
            return false;
        }

        let products: any = []
        selectedProducts.forEach((item: any) => {
            products.push({
                product_id: item.productId,
                order_line_item_id: item.orderLineItemId,
                product_name: item.productName,
                product_sku_code: item.sku,
                quantity: item.quantity,
                weight: item.weight,
                cost: item.cost,
                cost_inclusive: item.costInclusive,
                total: item.total,
            })
        });

        let formData = {
            purchase_order_id: purchaseOrderId,
            po_number: po_number,
            receiver_name: receiver_name,
            receiver_contact: receiver_contact,
            grn_date: grn_date,
            show_company_detail: show_company_detail ?? true,
            products: products,
            subtotal: cartSummary.subtotal,
            total: cartSummary.total,
        }

        console.log(formData);
        createGrnVoucherApi(formData)
            .then((res: any) => {
                if (res?.data?.response?.success === true && (res?.data?.response?.responseMessage === "Saved Successfully!" || res?.data?.response?.responseMessage === 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    setCartProducts([]);
                    setLatestGrnVoucherId(res?.data?.response?.primaryKeyValue);
                    setIsOpenReceiptModal(true);
                    setPurchaseOrderId(null);
                    reset();
                    setFormSubmitted(false);
                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
                    showErrorMsg("An error occurred. Please try again!");
                }
            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occurred. Please try again!");
            });
    };

    return (
        <>
            <Content>
                <KTCard>
                    <KTCardBody className='py-4'>
                        <form ref={formRefOrder} onSubmit={(e) => {
                            handleSubmit(handleSave)(e);
                            setFormSubmitted(true);
                        }}
                        >
                            <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>
                                <div className='row'>
                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label">PO Number</label>
                                            <input type="text" className={`form-control form-control-solid ${formSubmitted ?
                                                (errors.po_number ? 'is-invalid' : 'is-valid') : ''}`} id="po_number"
                                                {...register("po_number", { required: false })} readOnly={true}
                                                placeholder="PO Number" />
                                            {errors.po_number &&
                                                <SiteErrorMessage errorMsg='PO Ref is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Receiver Name</label>
                                            <input type="text" className={`form-control form-control-solid ${formSubmitted ?
                                                (errors.receiver_name ? 'is-invalid' : 'is-valid') : ''}`} id="receiver_name"
                                                {...register("receiver_name", { required: true })}
                                                placeholder="Enter receiver name" />
                                            {errors.receiver_name &&
                                                <SiteErrorMessage errorMsg='Receiver name is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Receiver Contact</label>
                                            <input type="text" className={`form-control form-control-solid ${formSubmitted ?
                                                (errors.receiver_contact ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="receiver_contact" {...register("receiver_contact", { required: true })}
                                                placeholder="Enter receiver contact" />
                                            {errors.receiver_contact &&
                                                <SiteErrorMessage errorMsg='Receiver contact is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Date</label>
                                            <input type="date" className={`form-control form-control-solid ${formSubmitted ?
                                                (errors.grn_date ? 'is-invalid' : 'is-valid') : ''}`} id="grn_date"
                                                {...register("grn_date", { required: true })} placeholder="Enter date" />
                                            {errors.grn_date &&
                                                <SiteErrorMessage errorMsg='Date is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className="mb-10">

                                            <div className="form-check mt-10">
                                                <input className="form-check-input" type="checkbox" id="show_company_detail"
                                                    {...register("show_company_detail")} />
                                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                                    Show Company Detail
                                                </label>
                                            </div>
                                            {errors.show_company_detail &&
                                                <SiteErrorMessage errorMsg='Tax status is required' />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </KTCardBody>
                </KTCard>

                <div className='card rounded-0 shadow-none border-0 bgi-no-repeat bgi-position-x-end bgi-size-cover mt-3 bgclor'
                    style={{ backgroundSize: 'auto 100%', }}>
                    <div className='card-body container-xxl pt-10 pb-8'>
                        <div className=' d-flex align-items-center'>
                            <h1 className='fw-bold me-3'>Search Purchase Order</h1>
                        </div>
                        <div className='d-flex flex-column'>
                            <div className='d-lg-flex align-lg-items-center'>
                                <div
                                    className='rounded d-flex flex-column flex-lg-row align-items-lg-center bg-body p-5 w-xxl-550px h-lg-60px me-lg-10 my-5'>
                                    <div className='row flex-grow-1 mb-5 mb-lg-0'>
                                        <div className='col-lg-8 d-flex align-items-center mb-3 mb-lg-0'>
                                            <KTIcon iconName='magnifier' className='fs-1 text-gray-500 me-1' />
                                            <ReactSelect isMulti={false} isClearable={true} placeholder="Search order"
                                                className="flex-grow-1" styles={customStyles} value={selectedOrderItemDropDown}
                                                onChange={handleSelectPurchaseOrder}
                                                options={selectedSearchOrderOptions} onInputChange={setSearchQueryOrder} />
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
                            <button type='button' className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                data-kt-menu-trigger='click' data-kt-menu-placement='bottom-end' data-kt-menu-flip='top-end'>
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
                                                <th className='min-w-50px'></th>
                                                <th className='min-w-100px'>SKU</th>
                                                <th className='min-w-250px'>Product</th>
                                                <th className='min-w-100px'>Cost</th>
                                                <th className='min-w-100px'>Quantity</th>
                                                <th className='min-w-100px'>Weight</th>
                                                <th className='min-w-100px'>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartProducts && cartProducts.length > 0
                                                    ?
                                                    <>
                                                        {
                                                            cartProducts?.map((item: any, index: number) => (
                                                                <tr key={"grn-item-" + index}>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input type="checkbox"
                                                                                checked={item?.isSelected}
                                                                                className="form-check-input me-2"
                                                                                onChange={(e) => handleLineItemChange(index, 'isSelected', e.target.checked)} />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {item?.sku}
                                                                    </td>
                                                                    <td>
                                                                        {item?.productName}
                                                                    </td>
                                                                    <td>
                                                                        <div>Base: {item?.cost?.toFixed(2)}</div>
                                                                        <div>Inclusive: {item?.costInclusive?.toFixed(2)}</div>
                                                                    </td>
                                                                    <td>
                                                                        <input className='form-control'
                                                                            type="number"
                                                                            step="0.01"
                                                                            min={0.1}
                                                                            value={item?.quantity}
                                                                            onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))} />
                                                                    </td>
                                                                    <td>
                                                                        <input className='form-control'
                                                                            type="number"
                                                                            step="0.01"
                                                                            min={0.1}
                                                                            value={item?.weight || 1}
                                                                            onChange={(e) => handleLineItemChange(index, 'weight', parseFloat(e.target.value))} />
                                                                        <span>(Remaining: {item?.remainingWeight?.toFixed(2)})</span>
                                                                    </td>
                                                                    <td>
                                                                        {item?.total?.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </>
                                                    :
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <div className='d-flex p-5 justify-content-center align-content-center'>
                                                                <h4 className='text-center'>No product found</h4>
                                                            </div>
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>Subtotal</td>
                                                <td>{cartSummary?.subtotal?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td>{cartSummary?.total?.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-start align-content-center">
                                    <button className="btn btn-primary fs-3" onClick={() => {
                                        if (formRefOrder.current) {
                                            formRefOrder.current.dispatchEvent(new Event('submit', {
                                                bubbles: true, cancelable: true
                                            }));
                                        }
                                    }}>
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} />
                                        Save
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {
                    isOpenReceiptModal === true
                        ?
                        <GrnVoucherReceiptModal
                            data={undefined}
                            voucherId={latestGrnVoucherId} />
                        :
                        <>
                        </>
                }
            </Content>
        </>
    )
}
