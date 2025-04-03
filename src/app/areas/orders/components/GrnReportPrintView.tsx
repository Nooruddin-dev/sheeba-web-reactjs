import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { GetFormattedDate, GetFormattedDateFromSqlDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";

const GrnReportPrintView: React.FC<{ afterPrint: any, report: any, startDate: any, endDate: any, sku: any }> = ({
    afterPrint,
    report,
    startDate,
    endDate,
    sku
}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        setTimeout(handlePrint);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'GRN Report',
        onAfterPrint: () => afterPrint(undefined)
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRef} className="print-view">
                <h2>GRN Report</h2>
                {report && (
                    <>
                        <div>
                            Date Range: <b>{GetFormattedDateFromSqlDate(startDate)} to {GetFormattedDateFromSqlDate(endDate)}</b> {sku && <>| SKU: <b>{sku}</b></>} | Print Date: <b>{GetFormattedDate(new Date())}</b>
                        </div>
                        <hr />
                    </>
                )}
                {
                    <div className="section">
                        <table>
                            <thead>
                                <tr>
                                    <th>GRN Date</th>
                                    <th>GRN Number</th>
                                    <th>PO Number</th>
                                    <th>Company</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    report.map((item: any, index: number) => (
                                        <tr key={`grn-${index}`}>
                                            <td>{GetFormattedDate(item.grnDate)}</td>
                                            <td>{item.grnNumber}</td>
                                            <td>{item.poNumber}</td>
                                            <td>{item.companyName}</td>
                                            <td>{item.productName} ({item.productSku})</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.weight}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>

            <style>
                {`
                    .print-view {
                        font-size: 12px;
                        padding: 10px;
                    }
                    .section {
                        margin-bottom: 15px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 4px;
                        text-align: left;
                    }
                    th {
                        background: #f0f0f0;
                    }
                `}
            </style>
        </div>
    );
}

export default GrnReportPrintView;