"use client";
import Sidebar, { MenuItem } from "@/components/Sidebar";

// Define your menu items with icons and labels
const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: "assets/picture/icons8-paint-48.png",
    path: "/workspace",
  },
  { label: "Profile", icon: "", path: "/dashboard/profile" },
  { label: "Settings", icon: "", path: "/dashboard/profile" },
];
export default function Page() {
  return (
    <div className="flex flex-row w-full h-full">
      <Sidebar items={menuItems} />
      <div className="flex flex-col">
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard</p>
      </div>
    </div>
  );
}
