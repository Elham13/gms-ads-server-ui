import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./mainpage/LandingPage";
import Order from "./Executive/order";
import ViewOrders from "./Admin/ViewOrders";
import AdminDashboard from "./Admin/AdminDashboard";
import AddExecutiveAdmin from "./Admin/AddExecutiveAdmin";
import ActivityChart from "./Admin/ActivityChart";
import PendingPayment from "./Admin/PendingPayment";
import PendingService from "./Admin/PendingService";
import SelectAppointment from "./Admin/SelectAppointment";
import Appointment from "./Executive/Appointment";
import ExecutiveDashboard from "./Executive/ExecutiveDashboard";
import NewAppointment from "./Executive/NewAppointment";
import DesignerDashboard from "./pages/DesignerDashboard";
import AccountDashboard from "./pages/AccountDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<Order />} />
        {/* 🔄 Fullscreen ViewOrders (used in Order form page) */}
        <Route path="/vieworders" element={<ViewOrders />} />
        {/* 🧩 Nested ViewOrders under AdminDashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="view-orders" element={<ViewOrders />} />
          {/* Nested route for Add Executive/Admin */}
          <Route path="add-executive" element={<AddExecutiveAdmin />} />
          <Route path="activity" element={<ActivityChart />} /> {/* ✅ NEW */}
          <Route path="pending-payment" element={<PendingPayment />} />{" "}
          {/* ✅ NEW */}
          <Route path="pending-service" element={<PendingService />} />{" "}
          {/* ✅ NEW */}
          <Route path="appointments" element={<Appointment />} /> {/* ✅ NEW */}
          <Route
            path="select-appointment"
            element={<SelectAppointment />}
          />{" "}
          {/* ✅ NEW */}
        </Route>
        <Route path="executive-dashboard" element={<ExecutiveDashboard />} />{" "}
        {/* ✅ NEW */}
        <Route path="pending-payment" element={<PendingPayment />} />{" "}
        {/* ✅ NEW */}
        <Route path="pending-service" element={<PendingService />} />{" "}
        {/* ✅ NEW */}
        <Route path="new-appointment" element={<NewAppointment />} />{" "}
        {/* ✅ NEW */}
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/account-dashboard" element={<AccountDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
