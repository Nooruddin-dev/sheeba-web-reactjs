import React, { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router';
import { reInitMenu } from '../../../../../_sitecommon/helpers';
import { LayoutProvider } from '../../../../../_sitecommon/layout/core';
import { ThemeModeProvider } from '../../../../../_sitecommon/partials';
import { HeaderWrapper } from '../../../../../_sitecommon/layout/components/header';
import { Sidebar } from '../../../../../_sitecommon/layout/components/sidebar';
import { FooterWrapper } from '../../../../../_sitecommon/layout/components/footer';
import { ScrollTop } from '../../../../../_sitecommon/layout/components/scroll-top';
import { MasterInit } from '../../../../../_sitecommon/layout/MasterInit';



interface AdminLayoutProps {
  children: ReactNode;
}




const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <>
      <LayoutProvider>
        <ThemeModeProvider>
          <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
            <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
              <HeaderWrapper />
              <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
                <Sidebar />
                <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
                  <div className='d-flex flex-column flex-column-fluid'>
                    {children}
                  </div>
                  <FooterWrapper />
                </div>
              </div>
            </div>
          </div>

          {/* begin:: Drawers */}
          {/* <ActivityDrawer /> */}
          {/* <RightToolbar />
          <DrawerMessenger /> */}
          {/* end:: Drawers */}

          {/* begin:: Modals */}
          {/* <InviteUsers />
          <UpgradePlan /> */}
          {/* end:: Modals */}
          <ScrollTop />




          <MasterInit />
        </ThemeModeProvider>
      </LayoutProvider>


    </>
  )
}

export default AdminLayout;