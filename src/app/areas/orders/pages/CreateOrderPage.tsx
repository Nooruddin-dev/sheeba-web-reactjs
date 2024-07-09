import React from 'react'
import CreatePurchaseOrderSub from '../components/CreatePurchaseOrderSub'
import AdminLayout from '../../common/components/layout/AdminLayout'
import AdminPageHeader from '../../common/components/layout/AdminPageHeader'

export default function CreateOrderPage() {
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
            <CreatePurchaseOrderSub
                orderDetailForEditClone={undefined}
                isEditCloneCase = {false}
            />
        </AdminLayout>
    )
}
