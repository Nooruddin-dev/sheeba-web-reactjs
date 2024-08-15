import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import AddUpdateJobCard from '../components/AddUpdateJobCard';
import { getJobCardDetailByIdForEditApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';

export default function EditJobCardPage() {
    const params = useParams();
    const job_card_id = params.job_card_id;


    const [enableEditJobCard, setEnableEditJobCard] = useState<boolean>(false);
    const [jobCardDetailForEdit, setJobCardDetailForEdit] = useState<any>(null);



    useEffect(() => {
        getJobCardDetailByIdForEdit();
    }, [job_card_id]);

    const getJobCardDetailByIdForEdit = () => {
        
        getJobCardDetailByIdForEditApi(job_card_id)
            .then((res: any) => {
                

                const { data } = res;
                if (data) {
                    setJobCardDetailForEdit(res?.data);
                } else {
                    setJobCardDetailForEdit({});
                }


                setEnableEditJobCard(true);


            })
            .catch((err: any) => console.log(err, "err"));
    };



    return (
        <AdminLayout>
            <AdminPageHeader
                title='Edit Job Card'
                pageDescription='Edit Job Card'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            {
                enableEditJobCard && enableEditJobCard == true
                    ?
                    <AddUpdateJobCard
                        jobCardDetailForEdit={jobCardDetailForEdit}
                    
                    />
                    :
                    <div className='container'>
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <h4>   Loading...</h4>
                        </div>

                    </div>

            }

        </AdminLayout>
    )
}
