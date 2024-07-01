import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { showWarningMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { gerPurchaseOrdersListForGrnVoucherBySearchTermApi, getPurchaseOrderDetailsForGrnVoucherApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';


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

export default function CreateGrnVoucherPage() {
    const defaultValues: any = {};
    const formRefOrder = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [cartAllLineItems, setCartAllLineItems] = useState<any>([]);
    const [selectedOrderItemDropDown, setSelectedOrderItemDropDown] = useState<any>(null);
    const [searchQueryOrder, setSearchQueryOrder] = useState('');
    const [selectedSearchOrderOptions, setSelectedSearchOrderOptions] = useState([]);


    const handleQuantityChange = (index: number, newQuantity: number) => {
        setCartAllLineItems((prevCart: any) => {
            const updatedCart = [...prevCart];
            updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
            return updatedCart;
        });
    };

    const handleCheckboxOrderItemChange = (index: number, checked: boolean) => {
        const updatedItems = cartAllLineItems.map((item: any, idx: number) => 
            idx === index ? { ...item, is_item_checked: checked } : item
        );
        setCartAllLineItems(updatedItems);
    };

    const createPurchaseOrder = () => {

    }

    const handleSelectPurchaseOrderDropDown = (selectedOption: any) => {

        setSelectedOrderItemDropDown(null);

        const purchase_order_id_selected = selectedOption?.value;

        getPurchaseOrderDetailsForGrnVoucherApi(purchase_order_id_selected)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    if (data?.purchase_orders_items && data?.purchase_orders_items.length > 0) {
                        for (const element of data?.purchase_orders_items) {
                            element.is_item_checked = true;
                        }
                        setCartAllLineItems(data?.purchase_orders_items);
                    }



                    setValue('po_number', data.po_number);
                }

            })
            .catch((err: any) => console.log(err, "err"));

    };


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
        <AdminLayout>
            <AdminPageHeader
                title='Create GRN Order'
                pageDescription='Create GRN Order'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <Content>


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

                            <span className='fw-bold text-white opacity-50'>Purchase Orders List</span>
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
                                            <label className="form-label ">Total Tax</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.total_tax ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="total_tax" {...register("total_tax", { required: false })}

                                                placeholder="Enter total tax"
                                            />
                                            {errors.total_tax && <SiteErrorMessage errorMsg='Total tax is required' />}
                                        </div>
                                    </div>

                                    <div className='col-lg-4'>
                                        <div className="mb-10">
                                            <label className="form-label ">Total Amount</label>
                                            <input
                                                type="number"
                                                min={0}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.total_amount ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="total_amount" {...register("total_amount", { required: false })}

                                                placeholder="Enter total amount"
                                            />
                                            {errors.total_amount && <SiteErrorMessage errorMsg='Total amount is required' />}
                                        </div>
                                    </div>



                                </div>

                            </div>



                        </form>



                    </KTCardBody>
                </KTCard>








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

                                                <th className='min-w-80px'>Code</th>
                                                <th className='min-w-100px'>Item Name</th>
                                                <th className='min-w-100px'>Quantity</th>
                                                <th className='min-w-80px'>Amount</th>

                                                {/* <th className='min-w-50px text-start'>Actions</th> */}
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                cartAllLineItems != undefined && cartAllLineItems.length > 0
                                                    ?
                                                    <>
                                                        {cartAllLineItems?.map((lineItem: any, index: number) => (
                                                            <tr key={index}>
                                                                <td role="cell" className="ps-3">
                                                                    <div className='d-flex'>
                                                                        <input type="checkbox" checked={lineItem.is_item_checked == true ? true : false} 
                                                                        className="form-check-input me-2"
                                                                        onChange={(e) => handleCheckboxOrderItemChange(index, e.target.checked)}
                                                                        />
                                                                        <span>
                                                                            {lineItem.code_sku}
                                                                        </span>

                                                                    </div>

                                                                </td>


                                                                <td>
                                                                    <div className='d-flex align-items-center'>

                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                {makeAnyStringShortAppenDots(lineItem?.product_name, 40)}
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                </td>



                                                                <td className='text-end '>
                                                                    <input
                                                                        className='form-select form-select-solid '
                                                                        type="number"
                                                                        min={1}
                                                                        value={lineItem.quantity || 1}
                                                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}

                                                                    />
                                                                </td>

                                                                <td className="text-center">45</td>




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
                                        {/* {
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
                                        } */}
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

                {/* {
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
                } */}

            </Content>
        </AdminLayout>
    )
}
