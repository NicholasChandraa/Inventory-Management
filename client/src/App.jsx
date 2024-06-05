/* eslint-disable */
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./component/Home/home";
import Layout from "./component/Layout/Layout";
import NotificationPage from "./component/navigation/notification/notificationPage";
import Login from "./component/Login/Login";
import LupaPassword from "./component/Login/LupaPassword";
import Cookies from "js-cookie";
import Register from "./component/Login/Register";
import Menu from "./component/Menus/Menu";
import ProductCategory from "./component/Product/ProductCategory";
import ProductPage from "./component/Product/ProductPage";
import AddProduct from "./component/Product/componentProduct/AddProduct";
import EditProduct from "./component/Product/componentProduct/EditProduct";
import ResetPassword from "./component/Login/ResetPassword";
import UserProfile from "./component/navigation/userProfile";
import ChangePasswordForm from "./component/navigation/ChangePasswordForm";
import { ProfileImageProvider } from "./context/ProfileImageContext";
import InventoryPage from "./component/Inventory/InventoryPage";
import ProductDetailPage from "./component/Product/ProductDetailPage";
import InventoryOutStock from "./component/Inventory/InventoryOutStock";
import InventoryStockMovement from "./component/Inventory/InventoryStockMovement";
import CustomerPage from "./component/Customers/CustomersPage";
import CustomerType from "./component/Customers/CustomerType";
import AddCustomers from "./component/Customers/components/addCustomers";
import DetailCustomer from "./component/Customers/components/detailCustomer";
import SalesPage from "./component/Sale/SalesPage";
import AddSales from "./component/Sale/AddSales";
import SaleDetail from "./component/Sale/SaleDetail";
import StockMovementDetails from "./component/Inventory/components/StockMovementDetails";
import DistributionPage from "./component/Distribution/DistributionPage";
import AddDistribution from "./component/Distribution/AddDistribution";
import EditDistribution from "./component/Distribution/EditDistribution";
import Dashboard from "./component/Dashboard/Dashboard";

function App() {
  const LoginRoute = (props) => {
    if (Cookies.get("Token") === undefined) {
      return props.children;
    } else if (Cookies.get("Token") !== undefined) {
      return <Navigate to={"/"} />;
    }
  };
  return (
    <>
      <ProfileImageProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/*"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/notifications"
              element={
                <Layout>
                  <NotificationPage />
                </Layout>
              }
            />
            <Route
              path="/Login/*"
              element={
                // <LoginRoute>
                <Login />
                // </LoginRoute>
              }
            />
            <Route path="/LupaPassword/*" element={<LupaPassword />} />
            <Route path="/Register/*" element={<Register />} />
            <Route
              path="/Product/*"
              element={
                <Layout>
                  <ProductPage />
                </Layout>
              }
            />
            <Route
              path="/Product/ProductPage/*"
              element={
                <Layout>
                  <ProductPage />
                </Layout>
              }
            />
            <Route
              path="/Product/ProductDetailPage/:id/*"
              element={
                <Layout>
                  <ProductDetailPage />
                </Layout>
              }
            />
            <Route
              path="/Product/ProductCategory/*"
              element={
                <Layout>
                  <ProductCategory />
                </Layout>
              }
            />
            <Route
              path="/Product/ProductPage/AddProduct/*"
              element={
                <Layout>
                  <AddProduct />
                </Layout>
              }
            />
            <Route
              path="/Product/ProductPage/EditProduct/:id"
              element={
                <Layout>
                  <EditProduct />
                </Layout>
              }
            />
            <Route path="/resetPassword/:token/*" element={<ResetPassword />} />
            <Route path="/Register/*" element={<Register />} />
            <Route
              path="/profile/updateProfile/*"
              element={
                <Layout>
                  <UserProfile />
                </Layout>
              }
            />

            <Route
              path="/profile/changePassword/*"
              element={
                <Layout>
                  <ChangePasswordForm />
                </Layout>
              }
            />

            <Route
              path="/inventory/*"
              element={
                <Layout>
                  <InventoryPage />
                </Layout>
              }
            />

            <Route
              path="/inventory/inventoryPage/*"
              element={
                <Layout>
                  <InventoryPage />
                </Layout>
              }
            />

            <Route
              path="/inventory/inventoryPage/InventoryOutStock/*"
              element={
                <Layout>
                  <InventoryOutStock />
                </Layout>
              }
            />

            <Route
              path="/inventory/inventoryPage/InventoryStockMovement/*"
              element={
                <Layout>
                  <InventoryStockMovement />
                </Layout>
              }
            />

            <Route
              path="/inventory/inventoryPage/InventoryStockMovement/Detail/:id"
              element={
                <Layout>
                  <StockMovementDetails />
                </Layout>
              }
            />

            <Route
              path="/customer/*"
              element={
                <Layout>
                  <CustomerPage />
                </Layout>
              }
            />

            <Route
              path="/customer/customerPage/*"
              element={
                <Layout>
                  <CustomerPage />
                </Layout>
              }
            />

            <Route
              path="/customer/customerPage/addCustomers/*"
              element={
                <Layout>
                  <AddCustomers />
                </Layout>
              }
            />

            <Route
              path="/customer/customerPage/customerType/*"
              element={
                <Layout>
                  <CustomerType />
                </Layout>
              }
            />

            <Route
              path="/customer/customerPage/detailCustomer/:customerId"
              element={
                <Layout>
                  <DetailCustomer />
                </Layout>
              }
            />

            <Route
              path="/sales/salesPage/*"
              element={
                <Layout>
                  <SalesPage />
                </Layout>
              }
            />

            <Route
              path="/sales/*"
              element={
                <Layout>
                  <SalesPage />
                </Layout>
              }
            />

            <Route
              path="/sales/salesPage/addSales/*"
              element={
                <Layout>
                  <AddSales />
                </Layout>
              }
            />

            <Route
              path="/sales/salesPage/saleDetail/:saleId"
              element={
                <Layout>
                  <SaleDetail />
                </Layout>
              }
            />

            <Route
              path="/distribution/*"
              element={
                <Layout>
                  <DistributionPage />
                </Layout>
              }
            />

            <Route
              path="/distribution/distributionPage/*"
              element={
                <Layout>
                  <DistributionPage />
                </Layout>
              }
            />

            <Route
              path="/distribution/distributionPage/addDistribution/*"
              element={
                <Layout>
                  <AddDistribution />
                </Layout>
              }
            />

            <Route
              path="/distribution/distributionPage/editDistribution/:id"
              element={
                <Layout>
                  <EditDistribution />
                </Layout>
              }
            />

            <Route
              path="/dashboard/*"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ProfileImageProvider>
    </>
  );
}

export default App;
