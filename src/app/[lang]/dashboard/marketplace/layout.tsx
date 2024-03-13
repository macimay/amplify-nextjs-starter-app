"use client";
import { TagWrapper } from "@/components/TagContext";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex flex-col">
      <TagWrapper>{children}</TagWrapper>
    </div>
  );
}
