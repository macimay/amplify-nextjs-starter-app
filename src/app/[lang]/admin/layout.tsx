"use client";
import Sidebar from "@/components/admin/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-row w-full h-full justify-start items-start">
        <div className="flex flex-col w-64 h-full justify-start ">
          <Sidebar />
        </div>
        {children}
      </div>
    </>
  );
}
