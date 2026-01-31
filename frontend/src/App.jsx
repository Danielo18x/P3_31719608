import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return(
    <>
      {/* Aquí cargamos toda nuestra lógica de navegación y componentes (Navbar, Footer, etc) */}
      <AppRoutes />
    </>
  );
}