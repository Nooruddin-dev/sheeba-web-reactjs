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
import { useNavigate, useParams } from "react-router";
import { getApprovedPurchaseOrderAutoComplete, getPurchaseOrderById } from "../../../../_sitecommon/common/helpers/api_helpers/ApiCalls";
import { showErrorMsg, showSuccessMsg } from "../../../../_sitecommon/common/helpers/global/ValidationHelper";
import { formatNumber } from "../../common/util";
import { VoucherApi } from "../../../../_sitecommon/common/api/voucher.api";
import GrnVoucherReceiptModal from "../components/GrnVoucherReceiptModal";

export default function ManageGrnVoucherPage(props: { isEditMode?: boolean }) {

    const { register, reset, getValues, trigger, formState: { errors } } = useForm({});
    const navigate = useNavigate();
    const param = useParams();
    const [voucherId, setVoucherId] = useState<number | undefined>(undefined);
    const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<any>(undefined);
    const [summary, setSummary] = useState<any>(undefined);
    const [lineItems, setLineItems] = useState<any[]>([]);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);
    const [printVoucherId, setPrintVoucherId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (props.isEditMode && param.id) {
            setVoucherId(parseInt(param.id));
        }
    }, [])

    useEffect(() => {
        if (voucherId) {
            VoucherApi.getById(voucherId)
                .then((res) => {
                    const grnData = res.data;
                    getPurchaseOrderById(grnData.purchaseOrderId)
                        .then((poRes) => {
                            const poData = poRes.data;
                            const orders = [{
                                value: poData.id,
                                label: poData.poNumber,
                                poNumber: poData.poNumber
                            }];
                            setPurchaseOrders(orders);
                            setSelectedPurchaseOrder(poData);
                            reset({
                                receiverName: grnData.receiverName,
                                receiverContact: grnData.receiverContact,
                                date: grnData.date.split('T')[0],
                                official: Boolean(grnData.isOfficial),
                            });
                            setLineItems(grnData.lineItems.map((item: any) => ({
                                isSelected: true,
                                id: item.orderLineItemId,
                                productId: item.productId,
                                quantity: Number(item.quantity || 0),
                                weight: Number(item.weight || 0),
                                cost: Number(item.cost),
                                costInclusive: Number(item.costInclusive),
                                itemName: item.productName,
                                sku: item.sku,
                                remainingQuantity: 0,
                                remainingWeight: 0,
                                subtotal: Number(item.cost) * (Number(item.weight) || Number(item.quantity)),
                                total: Number(item.total),
                            })));
                        })
                        .catch((err) => {
                            console.error('Error fetching purchase order details', err);
                        });
                })
                .catch((error) => {
                    console.error('Error fetching GRN:', error);
                });
        }
    }, [voucherId]);

    useEffect(() => {
        setSummary(() => {
            const total = lineItems.reduce((acc, item) => acc + (item.isSelected ? item.total : 0), 0);
            const subtotal = lineItems.reduce((acc, item) => acc + (item.isSelected ? item.subtotal : 0), 0);
            return {
                subtotal,
                total,
            };
        });
    }, [lineItems]);

    const afterPrint = () => {
        setIsOpenReceiptModal(false)
        navigate('/grn/vouchers-list');
    }

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        const selectedLineItems = lineItems.filter(item => item.isSelected);

        if (!selectedLineItems.length) {
            showErrorMsg('Please select at least one order item');
            return;
        }

        if (isValid && selectedPurchaseOrder) {
            const body = {
                id: voucherId,
                official: getValues('official') || false,
                receiverName: getValues('receiverName'),
                receiverContact: getValues('receiverContact'),
                date: getValues('date'),
                purchaseOrderId: selectedPurchaseOrder.id,
                poNumber: selectedPurchaseOrder.poNumber,
                subtotal: summary.subtotal,
                total: summary.total,
                lineItems: selectedLineItems.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    productName: item.itemName,
                    sku: item.sku,
                    quantity: item.quantity,
                    weight: item.weight,
                    cost: item.cost,
                    costInclusive: item.costInclusive,
                    total: item.total,
                })),
            };
            console.log('Form Body:', body);
            VoucherApi.put(body)
                .then((res) => {
                    showSuccessMsg(res.data.message || 'GRN voucher saved successfully');
                    setPrintVoucherId(res.data.primaryKeyValue);
                    setIsOpenReceiptModal(!isOpenReceiptModal);
                })
                .catch((err) => {
                    showErrorMsg(err.response?.data?.message || 'Failed to save GRN voucher');
                    console.error('Error saving GRN voucher', err);
                });
        }
    }

    const onQuantityChange = (index: number, value: number) => {
        setLineItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index].quantity = value;
            return updatedItems;
        });
    };

    const onWeightChange = (index: number, value: number) => {
        setLineItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index].weight = value;
            updatedItems[index].subtotal = updatedItems[index].cost * value;
            updatedItems[index].total = updatedItems[index].costInclusive * value;
            return updatedItems;
        });
    };

    const onPurchaseOrderSelected = (selectedOption: any) => {
        if (!selectedOption) {
            setSelectedPurchaseOrder(undefined);
            setLineItems([]);
            setSummary(undefined);
            return;
        }

        getPurchaseOrderById(selectedOption.value)
            .then((res) => {
                const poData = res.data;
                setSelectedPurchaseOrder(poData);
                const items = poData.items.map((item: any) => ({
                    isSelected: true,
                    id: item.id,
                    productId: item.productId,
                    quantity: Number(item.quantity || 0),
                    weight: Number(item.weight || 0),
                    cost: Number(item.cost),
                    costInclusive: Number(item.total) / (Number(item.weight) || Number(item.quantity)),
                    itemName: item.product,
                    sku: item.sku,
                    remainingQuantity: 0,
                    remainingWeight: 0,
                    subtotal: Number(item.cost) * (Number(item.weight) || Number(item.quantity)),
                    total: Number(item.total),
                }));
                setLineItems(items);
            })
            .catch((err) => {
                showErrorMsg(err.response?.data?.message || 'Failed to fetch purchase order details');
                console.error('Error fetching purchase order details', err);
            });
    }

    const onPurchaseOrderChange = (searchTerm: string) => {
        if (!searchTerm) {
            searchTerm = 'PO';
        }

        getApprovedPurchaseOrderAutoComplete(searchTerm)
            .then((res) => {
                const poOptions = res.data.map((po: any) => ({
                    value: po.id,
                    label: po.poNumber + ' - ' + po.reference,
                    poNumber: po.poNumber
                }))
                setPurchaseOrders(poOptions);
            })
            .catch((err) => {
                showErrorMsg(err.response?.data?.message || 'Failed to fetch purchase orders');
                console.error('Error fetching purchase orders', err);
            });
    }

    const onOrderItemSelectionChange = (index: number, isSelected: boolean) => {
        setLineItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index].isSelected = isSelected;
            return updatedItems;
        });
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title={props.isEditMode ? 'Update GRN Voucher' : 'Create GRN Voucher'}
                    pageDescription={props.isEditMode ? 'Update GRN Voucher' : 'Create GRN Voucher'}
                    addNewClickType={'link'}
                    newLink=''
                    additionalInfo={{ showAddNewButton: false }}
                />
                <Content>
                    <KTCard>
                        <KTCardBody className='py-4'>
                            <form>
                                <div className='modal-body py-lg-10 px-lg-10'>
                                    <div className='row'>
                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label ">Purchase Order</label>
                                                {
                                                    props.isEditMode ? (
                                                        <input
                                                            type="text"
                                                            className='form-control form-control-solid'
                                                            id="purchase-order-number"
                                                            disabled={true}
                                                            value={selectedPurchaseOrder?.poNumber}
                                                        />
                                                    ) : (
                                                        <ReactSelect isMulti={false} isClearable={true} placeholder="Select purchase order"
                                                            className="flex-grow-1"
                                                            onChange={onPurchaseOrderSelected}
                                                            options={purchaseOrders} onInputChange={onPurchaseOrderChange} />
                                                    )
                                                }

                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Receiver Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.receiverName ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="receiver-name" {...register("receiverName", { required: true })}
                                                    placeholder="Enter Receiver Name"
                                                />
                                                {errors.receiverName && <SiteErrorMessage errorMsg='Receiver name is required' />}
                                            </div>
                                        </div>

                                        <div className='col-lg-4'>
                                            <div className="mb-10">
                                                <label className="form-label required ">Receiver Contact</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-solid ${formSubmitted ? (errors.receiverContact ? 'is-invalid' : 'is-valid') : ''}`}
                                                    id="receiver-contact" {...register("receiverContact", { required: true })}
                                                    placeholder="Enter Receiver Contact"
                                                />
                                                {errors.receiverContact && <SiteErrorMessage errorMsg='Receiver contact is required' />}
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
                                            <div className="form-check" style={{ marginTop: '3rem' }}>
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
                        selectedPurchaseOrder ?
                            <div className="card card-xl-stretch mb-5 mb-xl-8 mt-5">
                                <div className='card-header border-0'>
                                    <h3 className='card-title fw-bold text-gray-900'>Order Items</h3>
                                </div>

                                <div className='card-body pt-0'>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className='table-responsive'>
                                                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                                    <thead>
                                                        <tr className='fw-bold text-muted'>
                                                            <th className='min-w-50px'></th>
                                                            <th className='min-w-100px'>SKU</th>
                                                            <th className='min-w-250px'>Product</th>
                                                            <th className='min-w-100px'>Cost</th>
                                                            <th className='min-w-100px'>Quantity</th>
                                                            <th className='min-w-100px'>Weight</th>
                                                            <th className='min-w-100px'>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            lineItems?.map((item: any, index: number) => {
                                                                return (
                                                                    <tr key={'line-item-' + index}>
                                                                        <td>
                                                                            <input
                                                                                className='form-check-input'
                                                                                type="checkbox"
                                                                                defaultChecked={item?.isSelected}
                                                                                onChange={(e) => onOrderItemSelectionChange(index, e.target.checked)} />
                                                                        </td>
                                                                        <td>{item?.sku}</td>
                                                                        <td>{item?.itemName}</td>
                                                                        <td>
                                                                            <div>Base: {formatNumber(item?.cost, 2)}</div>
                                                                            <div>Inclusive: {formatNumber(item?.costInclusive, 2)}</div>
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={100}
                                                                                defaultValue={formatNumber(item?.quantity, 2)}
                                                                                onChange={(e) => onQuantityChange(index, parseFloat(e.target.value))} />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type="number"
                                                                                step="0.01"
                                                                                max={100}
                                                                                defaultValue={formatNumber(item?.weight, 2)}
                                                                                onChange={(e) => onWeightChange(index, parseFloat(e.target.value))} />
                                                                            <span>(Remaining Weight: {formatNumber(item?.remainingWeight, 2)})</span>
                                                                        </td>
                                                                        <td>{formatNumber(item?.total, 2)}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td>Subtotal</td>
                                                            <td>{formatNumber(summary?.subtotal, 2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>{formatNumber(summary?.total, 2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="d-flex justify-content-start align-content-center">
                                                <button className="btn btn-primary fs-3" onClick={onSubmit}>
                                                    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} />
                                                    {props.isEditMode ? 'Update' : 'Save'}
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
                isOpenReceiptModal === true
                &&
                <GrnVoucherReceiptModal
                    afterPrint={afterPrint}
                    voucherId={printVoucherId} />
            }
        </>
    )
}

