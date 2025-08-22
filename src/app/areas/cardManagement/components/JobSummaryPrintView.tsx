import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { formatNumber } from "../../common/util";
import { GetFormattedDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { MachineTypesEnum } from "../../../../_sitecommon/common/enums/GlobalEnums";

const JobSummaryPrintView: React.FC<{ afterPrint: any, jobCards: any[], total: any }> = ({
    afterPrint,
    jobCards,
    total,
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
                <div className="header">
                    <h2>Job Summary Report</h2>
                    {
                        jobCards && jobCards.length === 1 && (
                            <>
                                <div>
                                    Job Card: <b>{jobCards[0].jobCardNo}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                                </div>
                                <hr />
                            </>
                        )
                    }
                    {
                        jobCards && jobCards.length > 1 && (
                            <>
                                <div>
                                    Start Job Card No: <b>{jobCards[0].jobCardNo}</b> | End Job Card No: <b>{jobCards[jobCards.length - 1].jobCardNo}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                                </div>
                                <hr />
                            </>
                        )
                    }
                </div>
                <div className="body">
                    {
                        jobCards?.map((jobCard: any, index: number) => {
                            return (
                                <div key={index} className="section page">
                                    <h4>Job Card: <b>{jobCard.jobCardNo}</b></h4>
                                    <h5>Product Name: <b>{jobCard.productName}</b></h5>
                                    <hr />
                                    {
                                        jobCard.machines?.map((item: any, index1: number) => (
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
                                                        {item.entries?.map((entry: any, index2: number) => (
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
                                                                <td>{formatNumber(total[jobCard.id][item.machineTypeId].trimming, 2)}</td>
                                                            }
                                                            {
                                                                item.machineTypeId === MachineTypesEnum.Cutting &&
                                                                <>
                                                                    <td>{formatNumber(total[jobCard.id][item.machineTypeId].handleCutting, 2)}</td>
                                                                    <td>{formatNumber(total[jobCard.id][item.machineTypeId].rejection, 2)}</td>
                                                                </>
                                                            }
                                                            {
                                                                ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                                                <td>{formatNumber(total[jobCard.id][item.machineTypeId]?.quantity, 2)}</td>
                                                            }
                                                            <td>{formatNumber(total[jobCard.id][item.machineTypeId]?.waste, 2)}</td>
                                                            <td>{formatNumber(total[jobCard.id][item.machineTypeId]?.gross, 2)}</td>
                                                            <td>{formatNumber(total[jobCard.id][item.machineTypeId]?.net, 2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ))}
                                    {
                                        jobCard.dispatches?.length > 0 && (
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
                                                        {jobCard.dispatches?.map((dispatch: any, index: number) => (
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
                                                            <td>{formatNumber(total[jobCard.id]['dispatch']?.quantity, 2)}</td>
                                                            <td>{formatNumber(total[jobCard.id]['dispatch']?.gross, 2)}</td>
                                                            <td>{formatNumber(total[jobCard.id]['dispatch']?.core, 2)}</td>
                                                            <td>{formatNumber(total[jobCard.id]['dispatch']?.net, 2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <style>
                {`
                .page {
                    break-after: page;
                    page-break-after: always; /* legacy */
                }

                .page:last-child {
                    break-after: auto;
                    page-break-after: auto;
                }

                .print-view {
                    font-size: 12px;
                    padding: 10px;

                }

                .section {
                    margin-bottom: 15px;
                }

                .section h4 {
                    text-align: center;
                }

                .section h5 {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    border: 1px solid #000;
                    padding: 4px;
                    text-align: left;
                }

                th {
                    background: #f0f0f0;
                }

                /* --- PRINT RULES --- */
                @media print {
                    /* Reliable margins for the whole page */
                    @page {
                        margin: 8mm;
                    }

                    /* Repeat table headers/footers when tables break across pages */
                    thead {
                        display: table-header-group;
                    }
                    tfoot {
                        display: table-footer-group;
                    }
                }
                `}
            </style>
        </div>
    );
}

export default JobSummaryPrintView;