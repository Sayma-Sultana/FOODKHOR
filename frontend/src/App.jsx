import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home";
import Success from "./Pages/Success";
import NotFound from "./Pages/NotFound";
import DishDetail from "./Pages/DishDetail";
import MenuPage from "./Pages/MenuPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminAuth from "./Pages/AdminAuth";
import AdminDashboard from "./Pages/AdminDashboard";
import Cart from "./Pages/Cart";
import AdminOrders from "./Pages/AdminOrders";
import OrderHistory from "./Pages/OrderHistory";
import AdminReservations from "./Pages/AdminReservations";
import AdminReservationHistory from "./Pages/AdminReservationHistory";
import AdminMenu from "./Pages/AdminMenu";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<Success />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/reservation-history" element={<AdminReservationHistory />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
