
import { KTIcon } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {


  return (
    <>
      <SidebarMenuItem
        to='/admin/dashboard'
        icon='element-11'
        title={'Dashboard'}
        fontIcon='bi-app-indicator'
      />




      {/* <SidebarMenuItemWithSub
        to='/admin/users/users-list'
        icon='user'
        title='User Management'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/site/users-list' title='Users List' hasBullet={true} />
        <SidebarMenuItem to='/site/business-partners-types' title='Business Partners Types' hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      <SidebarMenuItem
        to='/site/users-list'
        title='User Management'
        fontIcon='bi-layers'
        icon='user'
      />

      <SidebarMenuItem
        to='/site/machines-list'
        title='Machine Management'
        fontIcon='bi-archive'
        icon='setting-4'
      />



      {/* <SidebarMenuItemWithSub
        to=''
        title='Machine Management'
        fontIcon='bi-archive'
        icon='setting-4'
      >
        <SidebarMenuItem to='/site/machines-list' title='Machines List' hasBullet={true} />
        <SidebarMenuItem to='/site/machine-types' title='Machines Types' hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      <SidebarMenuItem
        to='/site/customer-management'

        title='Customer Management'
        fontIcon='bi-archive'
        icon='profile-circle'
      />

      <SidebarMenuItem
        to='/site/vendor-management'

        title='Vendor Management'
        fontIcon='bi-archive'
        icon='abstract-15'
      />


      <SidebarMenuItem
        to='/site/sale-representative-management'

        title='Sales Representative'
        fontIcon='bi-archive'
        icon='user-tick'
      />



      <SidebarMenuItem
        to='/site/products-list'
        title='Inventory Management'
        fontIcon='bi-archive'
        icon='grid-frame'
      />



      <SidebarMenuItemWithSub
        to=''
        title='Orders Management'
        fontIcon='bi-archive'
        icon='handcart'
      >
        <SidebarMenuItem to='/site/purchase-orders-list' title='Purchase Orders List' hasBullet={true} />
        <SidebarMenuItem to='/site/create-order' title='Create Order' hasBullet={true} />

      </SidebarMenuItemWithSub>


      <SidebarMenuItemWithSub
        to=''
        title='GRN Vouchers'
        fontIcon='bi-archive'
        icon='abstract-27'
      >
        <SidebarMenuItem to='/grn/vochers-list' title='GRN Vochers List' hasBullet={true} />
        <SidebarMenuItem to='/grn/create-voucher' title='Create GRN Voucher' hasBullet={true} />

      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to=''
        title='Job Card Management'
        fontIcon='bi-archive'
        icon='abstract-43'
      >
        <SidebarMenuItem to='/job-management/cards-list' title='Job Card List' hasBullet={true} />
        <SidebarMenuItem to='/job-management/production-entries' title='Production Entries' hasBullet={true} />

      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to=''
        title='Reports'
        fontIcon='bi-archive'
        icon='abstract-44'
      >
        <SidebarMenuItem to='/reports/dispatch-info' title='Job Dispatch Info' hasBullet={true} />
        <SidebarMenuItem to='/reports/machine-based' title='Machine Based Report' hasBullet={true} />
      

      </SidebarMenuItemWithSub>






    </>

  )
}

export { SidebarMenuMain }
