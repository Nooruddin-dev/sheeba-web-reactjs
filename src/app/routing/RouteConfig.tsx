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
import GrnVoucherListPage from '../areas/grnVoucher/pages/GrnVoucherListPage';
import CreateGrnVoucherPage from '../areas/grnVoucher/pages/CreateGrnVoucherPage';
import JobCardsListPage from '../areas/cardManagement/pages/JobCardsListPage';
import CreateJobCardPage from '../areas/cardManagement/pages/CreateJobCardPage';
import CreateOrdeClonePage from '../areas/orders/pages/CreateOrdeClonePage';
import GrnVoucherDetailPage from '../areas/grnVoucher/pages/GrnVoucherDetailPage';
import EditJobCardPage from '../areas/cardManagement/pages/EditJobCardPage';
import ProductionEntriesPage from '../areas/cardManagement/pages/ProductionEntriesPage';
import CardDispatchInfoPage from '../areas/cardManagement/pages/CardDispatchInfoPage';
import MachineBasedReportPage from '../areas/cardManagement/pages/MachineBasedReportPage';
import VendorOrderDetailsPage from '../areas/orders/pages/VendorOrderDetailsPage';
import SaleInvoiceListPage from '../areas/saleInvoice/pages/SaleInvoiceListPage';
import ManageSaleInvoicePage from '../areas/saleInvoice/pages/ManageSaleInvoicePage';
import ManageProductPage from '../areas/inventory/pages/ManageProductPage';
import ManageProductionEntry from '../areas/cardManagement/pages/ManageProductionEntry';



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

        <Route path="/site/products/create" element={
          <LoginProtectedRoute> <ManageProductPage /> </LoginProtectedRoute>
        } />
        
        <Route path="/site/products/:id" element={
          <LoginProtectedRoute> <ManageProductPage /> </LoginProtectedRoute>
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

        <Route path="/site/create-order-clone/:purchase_order_id" element={
          <LoginProtectedRoute> <CreateOrdeClonePage /> </LoginProtectedRoute>
        } />

        <Route path="/site/purchase-orders-list" element={
          <LoginProtectedRoute> <PurchaseOrdersListPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/purchase-order-detail/:purchase_order_id" element={
          <LoginProtectedRoute> <PurchaseOrderDetailPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/vendor/purchase-order-details/:purchase_order_id" element={
          <VendorOrderDetailsPage />
        } />

        <Route path="/grn/vochers-list" element={
          <LoginProtectedRoute> <GrnVoucherListPage /> </LoginProtectedRoute>
        } />

        <Route path="/grn/create-voucher" element={
          <LoginProtectedRoute> <CreateGrnVoucherPage /> </LoginProtectedRoute>
        } />

        <Route path="/site/grn-voucher-detail/:voucher_id" element={
          <LoginProtectedRoute> <GrnVoucherDetailPage /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/cards-list" element={
          <LoginProtectedRoute> <JobCardsListPage /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/create-card" element={
          <LoginProtectedRoute> <CreateJobCardPage /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/edit-card/:job_card_id" element={
          <LoginProtectedRoute> <EditJobCardPage /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/production-entries" element={
          <LoginProtectedRoute> <ProductionEntriesPage /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/production-entries/create" element={
          <LoginProtectedRoute> <ManageProductionEntry /> </LoginProtectedRoute>
        } />

        <Route path="/job-management/dispatch-info/:job_card_id" element={
          <LoginProtectedRoute> <CardDispatchInfoPage /> </LoginProtectedRoute>
        } />

        <Route path="/sale-invoice/list" element={
          <LoginProtectedRoute> <SaleInvoiceListPage /> </LoginProtectedRoute>
        } />

        <Route path="/sale-invoice/create" element={
          <LoginProtectedRoute> <ManageSaleInvoicePage /> </LoginProtectedRoute>
        } />

        <Route path="/sale-invoice/:id" element={
          <LoginProtectedRoute> <ManageSaleInvoicePage /> </LoginProtectedRoute>
        } />

        <Route path="/reports/dispatch-info" element={
          <LoginProtectedRoute> <CardDispatchInfoPage /> </LoginProtectedRoute>
        } />

        <Route path="/reports/machine-based" element={
          <LoginProtectedRoute> <MachineBasedReportPage /> </LoginProtectedRoute>
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
