import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { GetFormattedDate, GetFormattedDateFromSqlDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { formatNumber } from "../../common/util";

const DispatchReportPrintView: React.FC<{ afterPrint: any, report: any, startDate: any, endDate: any, official: any }> = ({
    afterPrint,
    report,
    startDate,
    endDate,
    official
}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        setTimeout(handlePrint);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Dispatch Report',
        onAfterPrint: () => afterPrint(undefined)
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRef} className="print-view">
                <h2>GRN Report</h2>
                {report && (
                    <>
                        <div>
                            Date Range: <b>{GetFormattedDateFromSqlDate(startDate)} to {GetFormattedDateFromSqlDate(endDate)}</b> | Official: <b>{official === 'true' ? 'Yes' : 'No'}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                        </div>
                        <hr />
                    </>
                )}
                {
                    <div className="section">
                        <table>
                            <thead>
                                <tr>
                                    <th>Dispatch Date</th>
                                    <th>Job Date</th>
                                    <th>Dispatch No</th>
                                    <th>Job Card No</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    report?.entries?.map((item: any, index: number) => (
                                        <tr key={`dispatch-${index}`}>
                                            <td>{GetFormattedDate(item.dispatchDate)}</td>
                                            <td>{GetFormattedDate(item.jobCardDate)}</td>
                                            <td>{item.dispatchNo}</td>
                                            <td>{item.jobCardNo}</td>
                                            <td>{item.product}</td>
                                            <td>{formatNumber(item.quantity, 2)}</td>
                                            <td>{formatNumber(item.weight, 2)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5}>Total</td>
                                    <td>{formatNumber(report?.summary?.totalQuantity, 2)} PCS</td>
                                    <td>{formatNumber(report?.summary?.totalWeight, 2)} KG</td>
                                </tr>
                            </tfoot>
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

export default DispatchReportPrintView;