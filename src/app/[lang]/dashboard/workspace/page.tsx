"use client";
import Sidebar, { MenuItem } from "@/components/Sidebar";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { useTeamContext } from "@/components/TeamContext";

// Define your menu items with icons and labels
var menuItems: MenuItem[] = [];
export default function Page() {
  const { session } = useTeamContext();
  const [products, setProducts] = useState<Schema["SubscriptionPool"][]>([]);
  const client = generateClient<Schema>({
    authMode: "apiKey",
  });
  useEffect(() => {
    console.log("Page useEffect called");
    const sub = client.models.SubscriptionPool.observeQuery({
      filter: {
        or: [
          { teamSubscriptionsId: { eq: session?.relation?.team?.id } },
          { status: { eq: "ACTIVE" } },
        ],
      },
      selectionSet: ["package.*", "package.product.*"],
    }).subscribe({
      next: ({ items, isSynced }) => {
        console.log("TeamProductPool event:", items);
        menuItems = [];
        items.map((item) => {
          console.log(item);
          menuItems.push({
            label: item.package.product.name,
            icon: item.package.product.icon!,
            path: item.package.product.shortName,
          });
        });
      },
      error: (error) => {
        console.error("Error:", error);
      },
    });
    // session.relation?.team.products.map((product: Schema["Product"]) => {
    //   console.log(product);
    //   menuItems.push({
    //     label: product.name,
    //     icon: product.icon!,
    //     path: product.shortName,
    //   });
    // });
  }, [session.relation.team]);

  return (
    <>
      <iframe src="/web/index.html" className="w-full" />
    </>
  );
}
