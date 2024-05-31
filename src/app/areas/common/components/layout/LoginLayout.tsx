import React, { ReactNode } from 'react'



import { LayoutProvider } from '../../../../../_sitecommon/layout/core';
import { ThemeModeProvider } from '../../../../../_sitecommon/partials';
import { MasterInit } from '../../../../../_sitecommon/layout/MasterInit';
import { MetronicI18nProvider } from '../../../../../_sitecommon/i18n/Metronici18n';



interface LoginLayoutProps {
  children: ReactNode;
}




const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <>
      <LayoutProvider>
        <ThemeModeProvider>
          {children}
          <MasterInit />
        </ThemeModeProvider>
      </LayoutProvider>


    </>
  )
}

export default LoginLayout;