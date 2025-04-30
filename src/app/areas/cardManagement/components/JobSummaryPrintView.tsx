import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { formatNumber } from "../../common/util";
import { GetFormattedDate, GetUnitShortName } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { MachineTypesEnum } from "../../../../_sitecommon/common/enums/GlobalEnums";

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
                                        {
                                            item.machineTypeId === MachineTypesEnum.Slitting &&
                                            <th>Trimming</th>
                                        }
                                        {
                                            item.machineTypeId === MachineTypesEnum.Cutting &&
                                            <>
                                                <th>Handle Cutting</th>
                                                <th>Rejection</th>
                                            </>
                                        }
                                        {
                                            ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                            <th>Quantity</th>
                                        }
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
                                            {
                                                item.machineTypeId === MachineTypesEnum.Slitting &&
                                                <td>{entry.trimming}</td>
                                            }
                                            {
                                                item.machineTypeId === MachineTypesEnum.Cutting &&
                                                <>
                                                    <td>{entry.handleCutting}</td>
                                                    <td>{entry.rejection}</td>
                                                </>
                                            }
                                            {
                                                ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                                <td>{entry.quantity}</td>
                                            }
                                            <td>{entry.waste}</td>
                                            <td>{entry.gross}</td>
                                            <td>{entry.net}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2}></td>
                                        {
                                            item.machineTypeId === MachineTypesEnum.Slitting &&
                                            <td>{formatNumber(total[item.machineTypeId].trimming, 2)}</td>
                                        }
                                        {
                                            item.machineTypeId === MachineTypesEnum.Cutting &&
                                            <>
                                                <td>{formatNumber(total[item.machineTypeId].handleCutting, 2)}</td>
                                                <td>{formatNumber(total[item.machineTypeId].rejection, 2)}</td>
                                            </>
                                        }
                                        {
                                            ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                            <td>{formatNumber(total[item.machineTypeId]?.quantity, 2)}</td>
                                        }
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
                                    <td>{formatNumber(total.dispatch?.quantity, 2)}</td>
                                    <td>{formatNumber(total.dispatch?.gross, 2)}</td>
                                    <td>{formatNumber(total.dispatch?.core, 2)}</td>
                                    <td>{formatNumber(total.dispatch?.net, 2)}</td>
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