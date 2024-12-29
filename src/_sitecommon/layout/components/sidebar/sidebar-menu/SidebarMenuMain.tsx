
import { KTIcon } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/globalStore/rootReducer';
import { menuConfig } from '../../../../common/constants/menuConfig';

const SidebarMenuMain = () => {
  let loginUser = useSelector((state: RootState) => state.userData.userData);
  //loginUser.role_type = 'admin'



  const filteredMenu = menuConfig
  .map((item) => {
    //-- Filter children based on roles
    const filteredChildren = item.children?.filter((child) =>
      child.roles ? child.roles.includes(loginUser.role_type) : true
    );

    //-- Include the item only if it has valid roles or filtered children
    if (item.roles.includes(loginUser.role_type) || (filteredChildren && filteredChildren.length > 0)) {
      return { ...item, children: filteredChildren };
    }

    return null;
  })
  .filter(Boolean); //-- Remove null values



  return (
    <>

        {filteredMenu.map((item, index) => (
          item?.children ? (
            <SidebarMenuItemWithSub
              to=""
              key={index}
              title={item?.title}
              icon={item?.icon}
              fontIcon={item?.fontIcon}
            >
              {item.children.map((child, childIndex) => (
                <SidebarMenuItem
                  key={`${index}-${childIndex}`}
                  to={child.to}
                  title={child.title}
                  hasBullet={child.hasBullet}
                />
              ))}
            </SidebarMenuItemWithSub>
          ) : (
            <SidebarMenuItem
              key={index}
              to={item?.to ?? ""}
              title={item?.title ?? ""}
              icon={item?.icon}
              fontIcon={item?.fontIcon}
            />
          )
        ))}
 




      {/* <SidebarMenuItem
        to='/admin/dashboard'
        icon='element-11'
        title={'Dashboard'}
        fontIcon='bi-app-indicator'
      />


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

      <SidebarMenuItem
        to='/sale-invoice/list'
        title='Sale Invoice'
        fontIcon='bi-archive'
        icon='abstract-43'
      >
      </SidebarMenuItem>


      <SidebarMenuItemWithSub
        to=''
        title='Reports'
        fontIcon='bi-archive'
        icon='abstract-44'
      >
        <SidebarMenuItem to='/reports/dispatch-info' title='Job Dispatch Info' hasBullet={true} />
        <SidebarMenuItem to='/reports/machine-based' title='Machine Based Report' hasBullet={true} />
      

      </SidebarMenuItemWithSub> */}






    </>

  )
}

export { SidebarMenuMain }
