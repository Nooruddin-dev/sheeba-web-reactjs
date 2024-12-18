import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { toAbsoluteUrl } from "../../../../_sitecommon/helpers";
import { getDateCommonFormatFromJsonDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { formatNumber } from "../../common/util";
import { getSalesInvoicesById } from "../../../../_sitecommon/common/helpers/api_helpers/ApiCalls";

const SaleInvoiceReceipt: React.FC<{ afterPrint: any, invoiceId?: number }> = ({
    afterPrint,
    invoiceId,
}) => {
    const [invoice, setInvoice] = useState<any>();
    const componentRefForReceipt = useRef(null);

    useEffect(() => {
        setTimeout(handlePrintReceipt);
    }, []);

    useEffect(() => {
        getSalesInvoicesById((invoiceId as number).toString())
            .then((resp) => {
                setInvoice(resp.data);
            });
    }, [invoiceId]);

    useEffect(() => {
        if (invoice) {
            setTimeout(handlePrintReceipt);
        }
    }, [invoice]);

    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Invoice',
        onAfterPrint: () => { afterPrint(undefined) }
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRefForReceipt} className="invoice-container" >
                <div className="header">
                    <div className="title">
                        {invoice?.official ? 'Sale Tax Invoice' : 'Sale Invoice'}
                    </div>
                    {
                        invoice?.official ?
                            <div className="right-content">
                                <div className="company-details">
                                    <p><strong>Sheeba Polybags Private Limited</strong></p>
                                    <p>W/H9/1 Sector 16-B North Karachi, Pakistan</p>
                                    <p>STN: 3277876348484</p>
                                    <p>NTN: C996443-7</p>
                                </div>
                                <div className="logo">
                                    <img src={toAbsoluteUrl('media/logos/default_dark_2.png')} alt="Company Logo" />
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>

                <table className="invoice-details">
                    <tr>
                        <th>Dispatch No:</th>
                        <td>{invoice?.dispatchNo}</td>
                        <th>Date:</th>
                        <td>{getDateCommonFormatFromJsonDate(invoice?.date)}</td>
                    </tr>
                    <tr>
                        <th>Customer Name:</th>
                        <td>{invoice?.customerName}</td>
                        <th>Customer NTN:</th>
                        <td>{invoice?.customerNTN}</td>
                    </tr>
                    <tr>
                        <th>Customer STN:</th>
                        <td>{invoice?.customerSTN}</td>
                        <th>Product Name:</th>
                        <td>{invoice?.itemName}</td>
                    </tr>
                    <tr>
                        <th>Customer Address:</th>
                        <td>{invoice?.customerAddress}</td>
                    </tr>
                </table>

                <div className="sale-items-container">
                    <table className="sale-items">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Discount</th>
                                <th>Sales Tax</th>
                                <th>Further Tax</th>
                                <th>Advance Tax</th>
                                <th>Total Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                invoice?.lineItems?.map((item: any) => {
                                    return (
                                        <tr>
                                            <td>{item?.itemName}</td>
                                            <td>{formatNumber(item?.rate, 2)}</td>
                                            <td>{formatNumber(item?.quantity, 2)}</td>
                                            <td>{formatNumber(item?.subtotal, 2)}</td>
                                            <td>{formatNumber(item?.discount, 2)}</td>
                                            <td>{formatNumber(item?.salesTax, 2)} ({formatNumber(item?.salesTaxPercentage, 2)})</td>
                                            <td>{formatNumber(item?.furtherTax, 2)} ({formatNumber(item?.furtherTaxPercentage, 2)})</td>
                                            <td>{formatNumber(item?.advanceTax, 2)} ({formatNumber(item?.advanceTaxPercentage, 2)})</td>
                                            <td>{formatNumber(item?.totalTax, 2)}</td>
                                            <td>{formatNumber(item?.total, 2)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="totals">
                    <p><strong>Subtotal:</strong>{formatNumber(invoice?.subtotal, 2)}</p>
                    <p><strong>Discount:</strong>{formatNumber(invoice?.discount, 2)}</p>
                    <p><strong>Tax:</strong>{formatNumber(invoice?.tax, 2)} ({formatNumber(invoice?.taxPercentage, 2)})</p>
                    <p><strong>Total Discount:</strong>{formatNumber(invoice?.totalDiscount, 2)}</p>
                    <p><strong>Total Tax:</strong>{formatNumber(invoice?.totalTax, 2)}</p>
                    <p className="grand-total"><strong>Grand Total:</strong>{formatNumber(invoice?.total, 2)}</p>
                </div>

                {
                    invoice?.notes ?
                        <div className="notes">
                            <p><strong>Notes:</strong> {invoice?.notes}</p>
                        </div>
                        : <></>
                }



                <div className="stamp-sign">
                    <div className="line">Stamp & Sign</div>
                </div>
            </div>
        </div>
    )
}

export default SaleInvoiceReceipt;