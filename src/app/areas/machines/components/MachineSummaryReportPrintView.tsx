import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { GetFormattedDate, GetFormattedDateFromSqlDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { formatNumber } from "../../common/util";
import { MachineTypesEnum } from "../../../../_sitecommon/common/enums/GlobalEnums";

const MachineSummaryReportPrintView: React.FC<{ afterPrint: any, report: any, total: any, startDate: any, endDate: any }> = ({
    afterPrint,
    report,
    total,
    startDate,
    endDate
}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        setTimeout(handlePrint);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Machine Summary Report',
        onAfterPrint: () => afterPrint(undefined)
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRef} className="print-view">
                <h2>Machine Summary Report</h2>
                {report && (
                    <>
                        <div>
                            Date Range: <b>{GetFormattedDateFromSqlDate(startDate)} to {GetFormattedDateFromSqlDate(endDate)}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                        </div>
                        <hr />
                    </>
                )}
                {
                    report.map((item: any, index1: number) => (
                        <div className="section" key={index1}>
                            <h3>{item.machineTypeName}</h3>
                            <table>
                                <thead>
                                    <tr>
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
                                            ![MachineTypesEnum.Cutting, MachineTypesEnum.Slitting].includes(item.machineTypeId) &&
                                            <th>Quantity</th>
                                        }
                                        <th>Waste</th>
                                        <th>Gross</th>
                                        <th>Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.machines.map((machine: any, index2: number) => (
                                        <tr key={`${index1}-${index2}`}>
                                            <td>{machine.machineName}</td>
                                            {
                                                item.machineTypeId === MachineTypesEnum.Slitting &&
                                                <td>{formatNumber(machine.trimming, 2)}</td>
                                            }
                                            {
                                                item.machineTypeId === MachineTypesEnum.Cutting &&
                                                <>
                                                    <td>{formatNumber(machine.handleCutting, 2)}</td>
                                                    <td>{formatNumber(machine.rejection, 2)}</td>
                                                </>
                                            }
                                            {
                                                ![MachineTypesEnum.Cutting, MachineTypesEnum.Slitting].includes(item.machineTypeId) &&
                                                <td>{machine.waste}</td>
                                            }
                                            <td>{machine.waste}</td>
                                            <td>{machine.gross}</td>
                                            <td>{machine.net}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        {
                                            item.machineTypeId === MachineTypesEnum.Slitting &&
                                            <td>{formatNumber(total[item.machineTypeId]?.trimming, 2)}</td>
                                        }
                                        {
                                            item.machineTypeId === MachineTypesEnum.Cutting &&
                                            <>
                                                <td>{formatNumber(total[item.machineTypeId]?.handleCutting, 2)}</td>
                                                <td>{formatNumber(total[item.machineTypeId]?.rejection, 2)}</td>
                                            </>
                                        }
                                        {
                                            ![MachineTypesEnum.Cutting, MachineTypesEnum.Slitting].includes(item.machineTypeId) &&
                                            <td>{formatNumber(total[item.machineTypeId]?.quantity, 2)}</td>
                                        }
                                        <td>{formatNumber(total[item.machineTypeId]?.waste, 2)}</td>
                                        <td>{formatNumber(total[item.machineTypeId]?.gross, 2)}</td>
                                        <td>{formatNumber(total[item.machineTypeId]?.net, 2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ))
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

export default MachineSummaryReportPrintView;