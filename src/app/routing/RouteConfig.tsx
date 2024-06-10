/* eslint-disable */

import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Link, Route, Navigate } from "react-router-dom";


import { ToastContainer } from 'react-toastify';
//-- ✅ Theme provider ends here
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../globalStore/rootReducer';
import LoginProtectedRoute from './LoginProtectedRoute';
import HomePage from '../areas/common/pages/HomePage';
import { Error404Page } from '../areas/common/pages/Error404Page';
import LoginPage from '../areas/auth/pages/LoginPage';
import UsersListPage from '../areas/businessPartners/pages/UsersListPage';
import BusinessPartnersTypesPage from '../areas/businessPartners/pages/BusinessPartnersTypesPage';
import CustomersListPage from '../areas/businessPartners/pages/CustomersListPage';
import VendorsListPage from '../areas/businessPartners/pages/VendorsListPage';
import SalesRepresentativePage from '../areas/businessPartners/pages/SalesRepresentativePage';
import ProductsListPage from '../areas/inventory/pages/ProductsListPage';
import MachineTypesPage from '../areas/machines/pages/MachineTypesPage';
import MachinesListPage from '../areas/machines/pages/MachinesListPage';
import CreateOrderPage from '../areas/orders/pages/CreateOrderPage';
import PurchaseOrdersListPage from '../areas/orders/pages/PurchaseOrdersListPage';
import PurchaseOrderDetailPage from '../areas/orders/pages/PurchaseOrderDetailPage';



export default function RouteConfig() {
  const loginUser = useSelector((state: RootState) => state.userData.userData);

  return (
    <>
      <Routes>



        <Route path="/" element={
          <LoginProtectedRoute> <HomePage /> </LoginProtectedRoute>
        } />

        <Route path="*" element={
          <LoginProtectedRoute> <HomePage />  </LoginProtectedRoute>
        } />

        <Route path="/site/users-list" element={
          <LoginProtectedRoute> <UsersListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/business-partners-types" element={
          <LoginProtectedRoute> <BusinessPartnersTypesPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/customer-management" element={
          <LoginProtectedRoute> <CustomersListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/vendor-management" element={
          <LoginProtectedRoute> <VendorsListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/sale-representative-management" element={
          <LoginProtectedRoute> <SalesRepresentativePage /> </LoginProtectedRoute>
        } />

        <Route path="/site/products-list" element={
          <LoginProtectedRoute> <ProductsListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/machine-types" element={
          <LoginProtectedRoute> <MachineTypesPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/machines-list" element={
          <LoginProtectedRoute> <MachinesListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/create-order" element={
          <LoginProtectedRoute> <CreateOrderPage /> </LoginProtectedRoute>
        } />


        <Route path="/site/purchase-orders-list" element={
          <LoginProtectedRoute> <PurchaseOrdersListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/purchase-order-detail/:purchase_order_id" element={
          <LoginProtectedRoute> <PurchaseOrderDetailPage /> </LoginProtectedRoute>
        } />


     


        {/* Common routes area starts here */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/app/error/404" element={<Error404Page />} />
        {/* Common routes area starts here */}

      </Routes>



      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        pauseOnHover={true}
        closeOnClick={true}
        theme="colored"
      />




    </>
  )
}
