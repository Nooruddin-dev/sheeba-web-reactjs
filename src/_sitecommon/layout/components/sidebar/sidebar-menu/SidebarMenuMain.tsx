
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

      {/* <SidebarMenuItemWithSub
        to=''
        title='Inventory Management'
        fontIcon='bi-archive'
        icon='grid-frame'
      >
        <SidebarMenuItem to='/site/products-list' title='Products List' hasBullet={true} />
        <SidebarMenuItem to='/site/inventory-list' title='Inventory Methods' hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      <SidebarMenuItemWithSub
        to=''
        title='Orders Management'
        fontIcon='bi-archive'
        icon='handcart'
      >
        <SidebarMenuItem to='/site/orders-list' title='Purchase Orders List' hasBullet={true} />
        <SidebarMenuItem to='/site/create-order' title='Create Order' hasBullet={true} />

      </SidebarMenuItemWithSub>





    </>

  )
}

export { SidebarMenuMain }
