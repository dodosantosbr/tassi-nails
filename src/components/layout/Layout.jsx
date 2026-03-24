import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex min-h-screen bg-rose-50/30">
      {/* Overlay mobile */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <Sidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      <div className="flex flex-col flex-1 md:ml-[220px]">
        <Topbar onMenuClick={() => setMenuAberto((v) => !v)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
