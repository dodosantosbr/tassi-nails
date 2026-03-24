import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: "◈", label: "Dashboard" },
  { to: "/agenda", icon: "◷", label: "Agenda" },
  { to: "/estoque", icon: "◫", label: "Estoque" },
];

export default function Sidebar({ aberto, onFechar }) {
  return (
    <aside
      className={`
      fixed top-0 left-0 bottom-0 w-[220px] bg-white border-r border-rose-100 flex flex-col z-50
      transition-transform duration-300
      ${aberto ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-rose-100 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-semibold text-rose-700 tracking-tight">
            Nail<span className="text-amber-400">Studio</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
            Pro
          </p>
        </div>
        <button
          onClick={onFechar}
          className="md:hidden text-gray-400 hover:text-rose-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onFechar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all
              ${
                isActive
                  ? "bg-rose-50 text-rose-700 font-medium"
                  : "text-gray-400 hover:bg-rose-50 hover:text-rose-500"
              }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-rose-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white text-xs font-medium">
            NS
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">Nail Studio</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
