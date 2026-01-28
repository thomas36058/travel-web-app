import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import Wishlist from "./pages/Wishlist";

const App = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default App;
