import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactSelect from "react-select";
import { KTCard, KTCardBody } from "../../../../_sitecommon/helpers";
import { Content } from "../../../../_sitecommon/layout/components/content";
import SiteErrorMessage from "../../common/components/shared/SiteErrorMessage";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import AdminLayout from "../../common/components/layout/AdminLayout";
import AdminPageHeader from "../../common/components/layout/AdminPageHeader";
import { createSalesInvoice, getDispatchAutoComplete } from "../../../../_sitecommon/common/helpers/api_helpers/ApiCalls";
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from "../../../../_sitecommon/common/helpers/global/ValidationHelper";
import { useNavigate } from "react-router";
import SaleInvoiceReceipt from "../components/SalesInvoiceReceipt";

export default function ManageSaleInvoicePage() {

    const { register, reset, getValues, trigger, formState: { errors } } = useForm({});
    const navigate = useNavigate();
    const [dispatches, setDispatches] = useState<any[]>([])
    const [lineItems, setLineItems] = useState<any[]>([]);
    const [invoiceSummary, setInvoiceSummary] = useState<any>({});
    const [selectedDispatch, setSelectedDispatch] = useState<any>(undefined);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [invoiceIdForPrint, setInvoiceIdForPrint] = useState<number>();

    useEffect(() => {
        if (selectedDispatch) {
            const lineItem = {
                id: '0001',
                itemName: selectedDispatch.itemName,
                rate: selectedDispatch.rate,
                quantity: selectedDispatch.quantity,
            };
            setLineItems([calculateLineItem(lineItem)])
        } else {
            setLineItems([])
        }
    }, [selectedDispatch])

    useEffect(() => {
        setInvoiceSummary((prevSummary: any) => {
            return { ...calculateInvoiceSummary(prevSummary, lineItems, prevSummary.taxPercentage) };
        });
    }, [lineItems])

    const calculateLineItem = (item: any) => {
        // Calculate subtotal
        item.subtotal = (item.rate || 0) * (item.quantity || 0);
        item.discountedSubtotal = (item.subtotal || 0) - (item.discount || 0);

        // Calculate taxes
        item.salesTax = (item.discountedSubtotal / 100) * (item.salesTaxPercentage || 0);
        item.furtherTax = (item.discountedSubtotal / 100) * (item.furtherTaxPercentage || 0);
        item.advanceTax = (item.salesTax / 100) * (item.advanceTaxPercentage || 0);
        item.totalTax = item.salesTax + item.furtherTax + item.advanceTax;

        // Calculate total
        item.total = item.discountedSubtotal + item.totalTax;
        return item;
    }

    const calculateInvoiceSummary = (invoiceSummary: any, lineItems: any[], newTaxPercentage?: any, newDiscount?: any) => {
        const taxPercentage = newTaxPercentage ?? invoiceSummary.taxPercentage;
        const discount = newDiscount ?? invoiceSummary.discount;
        let subtotal = 0;
        let totalLineItemTax = 0;
        let totalLineItemDiscount = 0;
        let taxAmount = 0;
        let totalTax = 0;
        let totalDiscount = 0;
        lineItems.forEach((item: any) => {
            subtotal += item.total;
            totalLineItemTax += item.totalTax || 0;
            totalLineItemDiscount += item.discount || 0;
        });
        taxAmount = (subtotal / 100) * (taxPercentage || 0);
        totalTax = totalLineItemTax + taxAmount;
        totalDiscount = totalLineItemDiscount + (discount || 0);
        const total = subtotal + taxAmount - (discount || 0);
        return { subtotal, totalLineItemTax, totalLineItemDiscount, taxPercentage, discount, taxAmount, totalDiscount, totalTax, total }
    }

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        if (isValid) {
            const formValue = getValues();
            const body = {
                jobCardId: selectedDispatch.jobCardId,
                dispatchId: selectedDispatch.dispatchId,
                official: formValue.official,
                date: formValue.date,
                notes: formValue.notes,
                customerName: formValue.customerName,
                customerAddress: formValue.customerAddress,
                customerNTN: formValue.customerNTN,
                customerSTN: formValue.customerSTN,
                lineItems: lineItems.map((item) => ({
                    id: item.id,
                    name: item.itemName,
                    rate: item.rate,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    discount: item.discount,
                    salesTaxPercentage: item.salesTaxPercentage,
                    furtherTaxPercentage: item.furtherTaxPercentage,
                    advanceTaxPercentage: item.advanceTaxPercentage,
                    salesTax: item.salesTax,
                    furtherTax: item.furtherTax,
                    advanceTax: item.advanceTax,
                    totalTax: item.totalTax,
                    total: item.subtotal,
                })),
                subtotal: invoiceSummary.subtotal,
                discount: invoiceSummary.discount,
                taxPercentage: invoiceSummary.taxPercentage,
                tax: invoiceSummary.taxAmount,
                totalDiscount: invoiceSummary.totalDiscount,
                totalTax: invoiceSummary.totalTax,
                total: invoiceSummary.total,
            };
            console.log(body);
            createSalesInvoice(body)
                .then((resp: any) => {
                    if (resp?.data?.success === true) {
                        showSuccessMsg("Saved Successfully!");
                        setSelectedDispatch(undefined);
                        reset();
                        setFormSubmitted(false);
                        setInvoiceIdForPrint(resp?.data?.primaryKeyValue);
                    } else if (resp?.data?.success === false && !stringIsNullOrWhiteSpace(resp?.data?.responseMessage)) {
                        showErrorMsg(resp?.data?.response?.responseMessage);
                    } else {
                        showErrorMsg("An error occurred. Please try again!");
                    }
                })
                .catch((err: any) => {
                    showErrorMsg("An error occurred. Please try again!");
                });
        }
    }

    const onLineItemChange = (index: number, key: string, value: number) => {
        setLineItems((prevItems: any) => {
            const items = [...prevItems];
            items[index] = { ...items[index], [key]: value ?? 0 };
            const updatedItem = calculateLineItem(items[index])
            items[index] = { ...items[index], ...updatedItem };
            return items;
        });

    };

    const onInvoiceTaxChange = (value: number) => {
        setInvoiceSummary((prevSummary: any) => {
            return { ...calculateInvoiceSummary(prevSummary, lineItems, value) };
        });
    }

    const onInvoiceDiscountChange = (value: number) => {
        setInvoiceSummary((prevSummary: any) => {
            return { ...calculateInvoiceSummary(prevSummary, lineItems, undefined, value) };
        });
    }

    const onDispatchChange = (value: any) => {
        getDispatchAutoComplete(value)
            .then((resp) => {
                const dropdownList = resp.data.map((data: any) => ({
                    label: data.dispatchNo, value: data
                }));
                setDispatches(dropdownList)
            })
    }

    const onDispatchSelected = (data: any) => {
        setSelectedDispatch(data ? data.value : undefined);
    }

    const onAfterPrint = () => {
        setInvoiceIdForPrint(undefined);
        navigate('/sale-invoice/list');
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='Create Sale Invoices'
                    pageDescription='v Sale Invoices'
                    addNewClickType={'link'}
                    newLink='/sale-invoice/create'
                    additionalInfo={{ showAddNewButton: false }}
                />
                <Content>
                    <KTCard>
                        <KTCardBody className='py-4'>
                            <form>
                                <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label ">Dispatch No</label>
                                                <ReactSelect isMulti={false} isClearable={true} placeholder="Select Dispatch No"
                                                    className="flex-grow-1"
                                                    onChange={onDispatchSelected}
                                                    options={dispatches} onInputChange={onDispatchChange} />
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label ">Company Name</label>
                                                <input
                                                    id="company-name"
                                                    type="text"
                                                    disabled
                                                    value={selectedDispatch?.companyName}
                                                    placeholder="Select Dispatch No"
                                                    className='form-control form-control-solid'
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label ">Product Name</label>
                                                <input
                                                    id="company-name"
                                                    type="text"
                                                    disabled
                                                    value={selectedDispatch?.itemName}
                                                    placeholder="Select Dispatch No"
                                                    className='form-control form-control-solid'
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Date</label>
                                                <input
                                                    type="date"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.date ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="date" {...register("date", { required: true })}
                                                    placeholder="Enter Date"
                                                />
                                                {errors.date && <SiteErrorMessage errorMsg='Date is required' />}
                                            </div>
                                        </div>


                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Customer Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.customerName ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="customer-name" {...register("customerName", { required: true })}
                                                    placeholder="Enter customer Name"
                                                />
                                                {errors.customerName && <SiteErrorMessage errorMsg='Customer name is required' />}
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Customer Address</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.customerAddress ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="customer-address" {...register("customerAddress", { required: true })}
                                                    placeholder="Enter customer Address"
                                                />
                                                {errors.customerAddress && <SiteErrorMessage errorMsg='Customer address is required' />}
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Customer NTN</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.customerNTN ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="customer-ntn" {...register("customerNTN", { required: true })}
                                                    placeholder="Enter customer NTN"
                                                />
                                                {errors.customerNtnNo && <SiteErrorMessage errorMsg='customer NTN number is required' />}
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Customer STN</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.customerSTN ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="customer-stn" {...register("customerSTN", { required: true })}
                                                    placeholder="Enter customer STN"
                                                />
                                                {errors.customerStnNo && <SiteErrorMessage errorMsg='Customer STN number is required' />}
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label ">Notes</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.notes ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="notes" {...register("notes", { required: false })}
                                                    placeholder="Enter Notes"
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="official"
                                                    {...register("official")} />
                                                <label className="form-check-label">
                                                    Official
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </KTCardBody>
                    </KTCard>

                    {
                        selectedDispatch ?
                            <div className="card card-xl-stretch mb-5 mb-xl-8 mt-5">
                                <div className='card-header border-0'>
                                    <h3 className='card-title fw-bold text-gray-900'>Sale Items</h3>
                                </div>

                                <div className='card-body pt-0'>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className='table-responsive'>
                                                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>
                                                            <th className='min-w-250px'>Item Name</th>
                                                            <th className='min-w-80px'>Rate</th>
                                                            <th className='min-w-100px'>Quantity</th>
                                                            <th className='min-w-100px'>Subtotal</th>
                                                            <th className='min-w-100px'>Discount</th>
                                                            <th className='min-w-100px'>Sales Tax %</th>
                                                            <th className='min-w-100px'>Further Tax %</th>
                                                            <th className='min-w-100px'>Advance Tax %</th>
                                                            <th className='min-w-110px'>Total Tax</th>
                                                            <th className='min-w-110px'>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            lineItems?.map((item: any, index: number) => {
                                                                return (
                                                                    <tr key={'line-item-' + index}>
                                                                        <td>
                                                                            <b>{item?.itemName}</b>
                                                                        </td>
                                                                        <td>{item?.rate}</td>
                                                                        <td>{item?.quantity}</td>
                                                                        <td>{item?.subtotal}</td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                value={item?.discount}
                                                                                onChange={(e) => onLineItemChange(index, 'discount', parseFloat(e.target.value))} />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={100}
                                                                                value={item?.salesTaxPercentage}
                                                                                onChange={(e) => onLineItemChange(index, 'salesTaxPercentage', parseFloat(e.target.value))} />
                                                                            <span>({item?.salesTax?.toFixed(2)})</span>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={100}
                                                                                value={item?.furtherTaxPercentage}
                                                                                onChange={(e) => onLineItemChange(index, 'furtherTaxPercentage', parseFloat(e.target.value))} />
                                                                            <span>({item?.furtherTax?.toFixed(2)})</span>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={100}
                                                                                value={item?.advanceTaxPercentage}
                                                                                onChange={(e) => onLineItemChange(index, 'advanceTaxPercentage', parseFloat(e.target.value))} />
                                                                            <span>({item?.advanceTax?.toFixed(2)})</span>
                                                                        </td>
                                                                        <td>{item?.totalTax?.toFixed(2)}</td>
                                                                        <td>{item?.total?.toFixed(2)}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td>Subtotal</td>
                                                            <td>{invoiceSummary?.subtotal?.toFixed(2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Discount</td>
                                                            <td>
                                                                <input
                                                                    className='form-control'
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={invoiceSummary?.discount}
                                                                    onChange={(e) => onInvoiceDiscountChange(parseFloat(e.target.value))} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tax %</td>
                                                            <td>
                                                                <input
                                                                    className='form-control'
                                                                    type="number"
                                                                    step="0.01"
                                                                    max={100}
                                                                    value={invoiceSummary?.taxPercentage}
                                                                    onChange={(e) => onInvoiceTaxChange(parseFloat(e.target.value))} />
                                                                <span>({invoiceSummary?.taxAmount?.toFixed(2)})</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total Discount</td>
                                                            <td>{invoiceSummary?.totalDiscount?.toFixed(2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total Tax</td>
                                                            <td>{invoiceSummary?.totalTax?.toFixed(2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>{invoiceSummary?.total?.toFixed(2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="d-flex justify-content-start align-content-center">
                                                <button className="btn btn-primary fs-3" onClick={onSubmit}>
                                                    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} />
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                </Content>
            </AdminLayout>
            {
                invoiceIdForPrint &&
                <SaleInvoiceReceipt
                    afterPrint={onAfterPrint}
                    invoiceId={invoiceIdForPrint} />
            }
        </>

    )
}

