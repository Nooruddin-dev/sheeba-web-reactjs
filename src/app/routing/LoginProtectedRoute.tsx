import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../globalStore/rootReducer';
import { Navigate } from 'react-router';


interface LoginProtectedRouteProps {
    children: ReactNode; // Allows passing any React component(s)
  }

const LoginProtectedRoute: React.FC<LoginProtectedRouteProps> = ({ children }) => {
    const loginUser = useSelector((state: RootState) => state.userData.userData);

    if (loginUser != undefined && loginUser != null && Object.keys(loginUser).length !== 0 && loginUser.busnPartnerId > 0) {
        //-- So here user is authorized so return child components
        return <>{children}</>;
    }


    return <Navigate to="/auth/login" />
}
export default LoginProtectedRoute;