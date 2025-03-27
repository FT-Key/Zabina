import { Route, Routes } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import SobreMi from "../pages/SobreMi";
import ProductDetail from "../pages/ProductDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminUsers from "../pages/AdminUsers";
import AdminProducts from "../pages/AdminProducts";
import AdminAppointments from "../pages/AdminAppointments";
import AppointmentRequest from "../pages/AppointmentRequest";
import AppointmentList from "../pages/AppointmentsList";
import Favoritos from "../pages/Favoritos";
import Carrito from "../pages/Carrito";
import ProtectedRoute from "../components/ProtectedRoute";
import PagosResult from "../pages/PagosResult";
import Planes from "../pages/Planes";
import ProductsComponent from "../pages/ProductsComponent";
import Comentarios from "../pages/Comentarios";

import { FloatingWhatsApp } from "react-floating-whatsapp";
import NailsComponent from "../pages/NailsComponent";

const RouteViews = () => {
  return (
    <>
      <FloatingWhatsApp
        phoneNumber="5493816152377"
        accountName="Zabina Store"
        avatar="https://i.pinimg.com/736x/ff/9b/f0/ff9bf06a2d5ddab45f35484ef12406e2.jpg"
        statusMessage="Normalmente responde en pocos minutos"
        chatMessage="¡Hola, bienvenido a ZabinaStore! ¿En qué puedo ayudarte?"
        placeholder="Escribe un mensaje..."
        allowClickAway={true}
        notification={false}
        notificationSound={false}
      />
      <NavigationBar />
      <Routes>
        <Route path="/productDetail/:productId" element={<ProductDetail />} />
        <Route path="/SobreMi" element={<SobreMi />} />
        <Route path="/inicioSesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/productos" element={<ProductsComponent />} />
        <Route path="/unas" element={<NailsComponent />} />
        <Route path="/comentarios" element={<Comentarios />} />

        {/* Rutas protegidas para roles específicos */}
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminProducts"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminAppointments"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas solo para usuarios autenticados */}
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Favoritos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagos/result/:result"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <PagosResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planes"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Planes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AppointmentRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/lista"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AppointmentList />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default RouteViews;