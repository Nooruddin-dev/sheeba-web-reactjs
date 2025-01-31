
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/globalStore/rootReducer';
import { menuConfig } from '../../../../common/constants/menuConfig';

const SidebarMenuMain = () => {
  let loginUser = useSelector((state: RootState) => state.userData.userData);
  const filteredMenu = menuConfig
    .map((item) => {
      const filteredChildren = item.children?.filter((child) =>
        child.roles ? child.roles.includes(loginUser.role_type) : true
      );
      if (item.roles.includes(loginUser.role_type) || (filteredChildren && filteredChildren.length > 0)) {
        return { ...item, children: filteredChildren };
      }

      return null;
    })
    .filter(Boolean);

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
    </>
  )
}

export { SidebarMenuMain }
