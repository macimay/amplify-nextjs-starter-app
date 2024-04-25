"use client";
import { Button } from "@/components/ui/button";
import { purchase } from "../action";
import { useTeamContext } from "@/components/TeamContext";
import { useEffect, useState } from "react";
import { auth } from "../../../../../../amplify/auth/resource";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/../amplify/data/resource";
import { Separator } from "@radix-ui/react-select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SubscriptionPage({
  params,
}: {
  params: { subscriptionId: string };
}) {
  const { session } = useTeamContext();
  const [productPackages, setProductPackages] = useState<
    Schema["ProductPackage"][]
  >([]);
  console.log(session);
  useEffect(() => {
    console.log(params.subscriptionId);
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.ProductPackage.list({
      filter: {
        subscriptionsPackagesId: { eq: params.subscriptionId },
      },
    }).then((data) => {
      console.log("productPackages:", data.data);
      setProductPackages(data.data);
    });
  }, [params.subscriptionId]);
  return (
    <div className="flex flex-col">
      <p id="summaryId" className="text-4xl">
        Summary
      </p>
      <Separator className="my-4" />
      <div id="packagesId" className="flex flex-col gap-4 h-space-4">
        {productPackages.map((productPackage) => {
          return (
            <Card>
              <CardHeader>{productPackage.product.name}</CardHeader>
              <CardContent>
                <div
                  key={productPackage.id}
                  className="flex flex-col h-128 gap-4"
                >
                  <div>{productPackage.name}</div>
                  <div>{productPackage.description}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* <Button
        onClick={() => {
          const result = purchase(
            session.relation.team.id,
            params.subscriptionId,
            100,
            "USD"
          );
          console.log(result);
        }}
      >
        Purchase
      </Button> */}
    </div>
  );
}
