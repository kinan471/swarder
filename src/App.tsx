import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminSettings from "@/pages/admin/AdminSettings";

function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="light" storageKey="spark-swarder-theme">
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              {/* مسارات الإدارة */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              {/* المسار الرئيسي للموقع العام */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
