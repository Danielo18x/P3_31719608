import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "../pages/public/landing/landing.jsx";
import Login from "../pages/public/login/login.jsx";
import Register from "../pages/public/register/register.jsx";
import Catalog from "../pages/public/catalog/catalog.jsx";
import Dashboard from "../pages/private/dashboard/dashboard.jsx";
import Checkout from "../pages/private/checkout/checkout.jsx";
import Orders from "../pages/private/orders/orders.jsx";
import Navbar from "../components/Navbar/navbar.jsx";
import Footer from "../components/Footer/footer.jsx";
import ProtectedRoute from "./Protected.jsx";
import React from "react";

function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);
    return null;
}

export default function AppRoutes() {
    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navbar />
        <ScrollToTop />
        <main className="flex-1">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Landing />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} /> 
                    <Route path="/checkout" element={<Checkout />} />
                </Route>
            </Routes>       
            
        </main>
        <Footer />
    </div>
    );
}