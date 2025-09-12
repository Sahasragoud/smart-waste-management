// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import Centers from "./pages/Centers";
import Rewards from "./pages/Rewards";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/protectedRoute";
import Users from "./pages/Users";
import Uploads from "./pages/Uploads";
import RewardsAdmin from "./pages/RewardsAdmin.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import UpdatePassword from "./pages/UpdatePassword.tsx";
import EditProfile from "./pages/EditProfile.tsx"; 
import GuidancePage from "./pages/Guidancepage";  // ✅ Import your GuidancePage

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-gray-800">
      <Navbar />

      <main className="flex-1 p-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* User pages */}
          <Route path="/scan" element={<Scan />} />
          <Route path="/results" element={<Results />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/rewards" element={<Rewards />} />

          {/* ✅ Guidance Route */}
          <Route path="/guidance/:category" element={<GuidancePage />} />

          {/* Leaderboard (protected for both user & admin) */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Users */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Admin Uploads */}
          <Route
            path="/admin/uploads"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Uploads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update-password"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />

          {/* Edit Profile */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Rewards */}
          <Route
            path="/admin/rewards"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RewardsAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
