    import React, { useEffect, useState } from 'react'
    import CreatePurchaseOrderSub from '../components/CreatePurchaseOrderSub'
    import { useParams } from 'react-router';
    import AdminLayout from '../../common/components/layout/AdminLayout';
    import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
    import { getPurchaseOrderDetailForEditCloneByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';

    export default function CreateOrdeClonePage() {
        const params = useParams();
        const purchase_order_id = params.purchase_order_id;

        const [enableOrderCreateArea, setEnableOrderCreateArea] = useState<boolean>(false);
        const [orderDetailForEditClone, setOrderDetailForEditClone] = useState<any>(null);



        useEffect(() => {
            getOrderDetailsByIdService();
        }, [purchase_order_id]);

        const getOrderDetailsByIdService = () => {


            getPurchaseOrderDetailForEditCloneByIdApi(purchase_order_id)
                .then((res: any) => {

                    const { data } = res;
                    if (data) {
                        setOrderDetailForEditClone(res?.data);
                    } else {
                        setOrderDetailForEditClone({});
                    }


                    setEnableOrderCreateArea(true);



                })
                .catch((err: any) => console.log(err, "err"));
        };



        return (
            <AdminLayout>
                <AdminPageHeader
                    title='Create Order'
                    pageDescription='Create Order'
                    addNewClickType={'modal'}
                    newLink={''}
                    onAddNewClick={undefined}
                    additionalInfo={{
                        showAddNewButton: false
                    }
                    }
                />

                {
                    enableOrderCreateArea && enableOrderCreateArea == true
                        ?
                        <CreatePurchaseOrderSub
                            orderDetailForEditClone={orderDetailForEditClone}
                            isEditCloneCase = {true}
                        />
                        :
                        <div className='container'>
                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <h4>   Cloning...</h4>
                            </div>

                        </div>

                }

            </AdminLayout>
        )
    }
