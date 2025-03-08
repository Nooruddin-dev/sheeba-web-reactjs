import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../../../../src/_sitecommon/assets/sass/components/invoice-print.scss';
import { GetFormattedDate, GetProductTypeName, GetUnitShortName } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import { ProductTypeEnum } from "../../../../_sitecommon/common/enums/GlobalEnums";

const StockReportPrintView: React.FC<{ afterPrint: any, units: any, report: any, source: any, type: any }> = ({
    afterPrint,
    units,
    report,
    source,
    type
}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        setTimeout(handlePrint);
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Stock Report',
        onAfterPrint: () => afterPrint(undefined)
    });

    return (
        <div style={{ display: 'none' }}>
            <div ref={componentRef} className="print-view">
                <h2>Stock Report</h2>
                {
                    report && (
                        <>
                            <div>
                                Source: <b>{source || 'All'}</b> | Type: <b>{type ? GetProductTypeName(type) : 'All'}</b> | Print Date: <b>{GetFormattedDate(new Date())}</b>
                            </div>
                            <hr />
                        </>
                    )
                }
                {
                    <div className="section">
                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    report.map((product: any, index: number) => (
                                        <tr key={product?.id || 'product-' + index}>
                                            <td>{product.sku}</td>
                                            <td>
                                                <div>
                                                    {product.name}
                                                    {product.type.toString() === ProductTypeEnum.Roll && (
                                                        <span> (W: {product.width}, L: {product.length}, M: {product.micron})</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{GetProductTypeName(product.type)}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.weight} {GetUnitShortName(units, product.weightUnitId)}</td>
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

export default StockReportPrintView;