import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Estoque from "./pages/Estoque";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="estoque" element={<Estoque />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
