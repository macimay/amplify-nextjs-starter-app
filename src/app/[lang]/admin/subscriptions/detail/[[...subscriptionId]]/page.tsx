"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/api";
import { SubscriptionsType } from "@/type/SubscriptionsType";
import DetailForm from "@/components/admin/DetailForm";
import { z } from "zod";
import { Separator } from "@radix-ui/react-select";

import PackagesSelectionComponent from "@/components/admin/PacakgesSelectionComponent";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function SubscriptionDetail({
  params: { subscriptionId },
}: {
  params: { subscriptionId: string };
}) {
  const subscriptionDetailSelectionSet = [
    "id",
    "name",
    "price",
    "currency",
    "capacity",
    "period",
    "level",
    "amount",
    "description",
    "region",
    "publish",
    "isExpired",
    "availableAt",
    "expireAt",
    "expireInDays",
    "packages.productPackage.id",
    "packages.productPackage.name",
    "packages.productPackage.description",
    "packages.productPackage.product.name",
  ] as const;
  type SubscriptionDetailDataType = SelectionSet<
    Schema["Subscriptions"],
    typeof subscriptionDetailSelectionSet
  >;

  const [subscription, setSubscription] = useState<SubscriptionsType>();
  const [subscriptionDetail, setSubscriptionDetail] =
    useState<SubscriptionDetailDataType>();

  console.log(subscriptionId);
  useEffect(() => {
    async function fetchData() {
      if (!subscriptionId) {
        //create new one
        setSubscription(SubscriptionsType.createEmpty());
      } else {
        console.log("subscriptionId:", subscriptionId);
        const client = generateClient<Schema>({ authMode: "apiKey" });
        const { data: subscription } = await client.models.Subscriptions.get(
          {
            id: subscriptionId[0],
          },
          {
            selectionSet: subscriptionDetailSelectionSet,
          }
        );
        console.log("fetch subscription:", subscription);
        // const { data: subscriptionsPackages } = await subscription.packages();
        // setPackages(subscriptionsPackages);
        setSubscriptionDetail(subscription);

        setSubscription(SubscriptionsType.fromSubscriptions(subscription));
      }
    }
    fetchData();
  }, []);
  return (
    <div className="flex flex-col container">
      {subscription && (
        <DetailForm
          data={subscription!}
          onSubmitCallback={(values: z.infer<z.ZodObject<any, any>>) => {
            console.log("values:", values);

            const client = generateClient<Schema>({ authMode: "apiKey" });
            if (values.id.length == 0) {
              //create subscription
              console.log("create subscription");
              client.models.Subscriptions.create({
                name: values.name,
                price: values.price,
                currency: values.currency,
                capacity: values.capacity,
                period: values.period,
                level: values.level,
                amount: values.amount,
                description: values.description,
                region: values.region,
                publish: values.publish,
                isExpired: values.expireInfo.isExpire,
                availableAt: values.expireInfo.availableAt,
                expireAt: values.expireInfo.expireAt,
                expireInDays: values.expireInfo.expireInDays,
              }).then((data) => {
                console.log("create subscription:", data);
              });
            } else {
              //update subscription
              console.log("update subscription");
              client.models.Subscriptions.update({
                id: values.id,
                name: values.name,
                price: values.price,
                currency: values.currency,
                capacity: values.capacity,
                period: values.period,
                level: values.level,
                amount: values.amount,
                description: values.description,
                region: values.region,
                publish: values.publish,
                isExpired: values.isExpired,
                availableAt: values.availableAt,
                expireAt: values.expireAt,
                expireInDays: values.expireInDays,
              }).then((data) => {
                console.log("update subscription:", data);
              });
            }
          }}
        />
      )}

      <Separator className="my-8" />
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Packages
          </h2>

          {subscription && (
            <PackagesSelectionComponent
              packagesSelected={[]}
              filterType="region"
              filterValue={subscription?.region || "GLOBAL"}
              onSubmitCallback={(selectedPackages) => {
                console.log("selectedPackages:", selectedPackages);

                const client = generateClient<Schema>({ authMode: "apiKey" });
                selectedPackages.map((p) => {
                  client.models.ProductPackageSubscriptions.create({
                    productPackageId: p.id,
                    subscriptionsId: subscription.id,
                  }).then((data) => {
                    console.log("update package:", data);
                  });
                });
              }}
            />
          )}
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Product Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionDetail?.packages.map((packageDetail) => (
                <TableRow key={packageDetail.productPackage.id}>
                  <TableCell>{packageDetail.productPackage.id}</TableCell>
                  <TableCell>{packageDetail.productPackage.name}</TableCell>
                  <TableCell>
                    {packageDetail.productPackage.description}
                  </TableCell>
                  <TableCell>
                    {packageDetail.productPackage.product.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* {subscription && (
        <SubscriptionPackagesComponent
          subscriptionId={subscription.id}
          region={subscription.region}
        />
      )} */}
      <Separator />
    </div>
  );
}
