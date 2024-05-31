import React from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import AdminPageHeader from '../components/layout/AdminPageHeader'
import { Content } from '../../../../_sitecommon/layout/components/content'
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers'
import CommonListSearchHeader from '../components/layout/CommonListSearchHeader'

export default function HomePage() {
  return (
    <AdminLayout>
    <AdminPageHeader
        title='Dashboard'
        pageDescription='Dashboard'
        addNewClickType={'modal'}
        newLink={''}
        onAddNewClick={undefined}
        additionalInfo={{
            showAddNewButton: false
        }
        }
    />

    <Content>
        {/* <KTCard>

         
        
            <KTCardBody className='py-4'>
               
              


               


            </KTCardBody>
        </KTCard> */}
    </Content>
</AdminLayout>
  )
}
