import Sidebar from "@/components/Sidebar";

export default function LabHomePage() {
  const menuItems = [
    {
      label: "Home",
      icon: "/assets/picture/icons8-paint-48.png",
      path: "/workspace",
    },
    { label: "Profile", icon: "", path: "/dashboard/profile" },
  ]; // Define the menuItems variable

  return (
    <div className="flex flex-row w-full h-full">
      <Sidebar items={menuItems} />
      <iframe src="/web/index.html" className="w-full" />
    </div>
  );
}
