import { Outlet } from "react-router";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
