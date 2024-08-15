import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import AddUpdateJobCard from '../components/AddUpdateJobCard';

export default function CreateJobCardPage() {


    return (
        <AdminLayout>
            <AdminPageHeader
                title='Create Job'
                pageDescription='Create Job'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <AddUpdateJobCard
                jobCardDetailForEdit={null}

            />

        </AdminLayout>
    )
}
