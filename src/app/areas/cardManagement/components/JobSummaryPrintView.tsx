import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { formatNumber } from "../../common/util";
import { GetFormattedDate, GetUnitShortName } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";

const JobSummaryPrintView: React.FC<{ afterPrint: any, units: any, report: any, total: any, jobCardNo: string, productName: string }> = ({
    afterPrint,
    units,
    report,
    total,
    jobCardNo,
    productName
}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        setTimeout(handlePrint);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Job Summary',
        onAfterPrint: () => afterPrint(undefined)
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRef} className="print-view">
                <h2>Job Summary Report</h2>
                {report && (
                    <>
                        <div>
                            Job Card: <b>{jobCardNo}</b> | Product Name: <b>{productName}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                        </div>
                        <hr />
                    </>
                )}
                {report?.machines?.length > 0 &&
                    report.machines.map((item: any, index1: number) => (
                        <div key={index1} className="section">
                            <h3>{item.machineTypeName}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Machine</th>
                                        <th>Waste</th>
                                        <th>Gross</th>
                                        <th>Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.entries.map((entry: any, index2: number) => (
                                        <tr key={`${index1}-${index2}`}>
                                            <td>{GetFormattedDate(entry.date)}</td>
                                            <td>{entry.machineName}</td>
                                            <td>{entry.waste}</td>
                                            <td>{entry.gross}</td>
                                            <td>{entry.net}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td>{formatNumber(total[item.machineTypeId]?.waste, 2)}</td>
                                        <td>{formatNumber(total[item.machineTypeId]?.gross, 2)}</td>
                                        <td>{formatNumber(total[item.machineTypeId]?.net, 2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ))}
                {report?.dispatches?.length > 0 && (
                    <div className="section">
                        <h3>Dispatch</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Quantity</th>
                                    <th>Gross</th>
                                    <th>Core</th>
                                    <th>Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.dispatches.map((dispatch: any, index: number) => (
                                    <tr key={index}>
                                        <td>{GetFormattedDate(dispatch.date)}</td>
                                        <td>{dispatch.quantity}</td>
                                        <td>{dispatch.gross}</td>
                                        <td>{dispatch.core}</td>
                                        <td>{dispatch.net}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td>{total.dispatch?.quantity}</td>
                                    <td>{total.dispatch?.gross}</td>
                                    <td>{total.dispatch?.core}</td>
                                    <td>{total.dispatch?.net}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
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

export default JobSummaryPrintView;