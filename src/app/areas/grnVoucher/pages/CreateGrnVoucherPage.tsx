import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import CreateGrnVoucherPageSub from '../components/CreateGrnVoucherPageSub';


export default function CreateGrnVoucherPage() {
  

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Create GRN Order'
                pageDescription='Create GRN Order'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <CreateGrnVoucherPageSub/>

        



        </AdminLayout>
    )
}
