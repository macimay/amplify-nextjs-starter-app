"use client";
import { Schema } from "@/../amplify/data/resource";

import { TagWrapper, useTagContext } from "@/components/TagContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SelectionSet, generateClient } from "aws-amplify/api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useTeamContext } from "@/components/TeamContext";
import { Separator } from "@/components/ui/separator";
import LoadingComponent from "@/components/LoadingComponent";
import ProductDescriptionComponent from "@/components/ProductDescriptionComponent";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// const DynamicComponentLoader = ({
//   componentName,
// }: {
//   componentName: string;
// }) => {
//   const [Component, setComponent] = useState<React.ComponentType | undefined>();

//   useEffect(() => {
//     const loadComponent = async () => {
//       const component = await import(`./components/${componentName}`);
//       console.log("component:", component);
//       setComponent(() => component.default);
//     };

//     loadComponent();
//   }, [componentName]);

//   if (!Component) return <div>Loading component...</div>;
//   return <Component />;
// };

export default function MarketplacePage() {
  const router = useRouter();
  const { tagSelected, setTagSelected } = useTagContext();
  const { region, session } = useTeamContext();

  const activeSubscription = session?.activeSubscription ?? "none";

  const selectionSet = [
    "id",
    "name",
    "shortName",
    "description.*",
    // "description.description",
    // "description.imageKey",
    // "description.publish",
    "icon",
    "publish",
    "createdAt",
    "updatedAt",
  ] as const;
  type ProductWithPackage = SelectionSet<
    Schema["Product"],
    typeof selectionSet
  >;
  const [products, setProducts] = useState<ProductWithPackage[]>([]);

  const subSelectionSet = [
    "id",
    "name",
    "packages.name",
    "packages.product.*",
  ] as const;
  type SubscriptionWithPackage = SelectionSet<
    Schema["Subscriptions"],
    typeof subSelectionSet
  >;
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPackage[]>(
    []
  );

  const [primeSubscription, setPrimeSubscription] = useState<String>();

  const findSubscription = (productId: string) => {
    return subscriptions.map((subscription) => {
      return subscription.packages.find((productPackage) => {
        return productPackage.product.id === productId;
      });
    });
  };

  const client = generateClient<Schema>();

  useEffect(() => {
    client.models.Subscriptions.list({
      filter: {
        region: { eq: region },
        priority: { eq: 1 },
      },
    }).then((data) => {
      console.log("subscriptions:", data.data);
      if (data.data.length) setPrimeSubscription(data.data[0].id);
    });
  }, []);
  useEffect(() => {
    async function fetchProducts() {
      client.models.Product.list({
        filter: {
          publish: { eq: true },
        },
        selectionSet: selectionSet,
      }).then((data) => {
        setProducts(data.data);
        console.log("products:", data.data);
      });
    }
    async function fetchSubscriptions() {
      client.models.Subscriptions.list({
        filter: {
          region: { eq: region },
        },
        selectionSet: subSelectionSet,
      }).then((data) => {
        console.log("subscriptions:", data.data);
        setSubscriptions(data.data);
      });
    }
    fetchProducts().then(() => {
      fetchSubscriptions();
    });
  }, []);
  const t = useTranslations("MarketPlace");
  return products.length === 0 ? (
    <LoadingComponent />
  ) : (
    <>
      <div className="container flex flex-col items-between">
        <div className="container list-disc list-inside  gap-4 justify-items-center ">
          {primeSubscription && (
            <div className="flex flex-row justify-between  mb-10">
              <p className="flex flex-row">
                加入premier会员，单次付费，享受多大xxx服务订阅服务
              </p>

              <Button asChild>
                <Link href={`/dashboard/subscription/${primeSubscription}`}>
                  立即加入
                </Link>
              </Button>
            </div>
          )}
          <div className="flex flex-col">
            {products.map((product) => {
              const productSubs = findSubscription(product.id);
              return (
                <Card
                  key={product.id}
                  className="w-full h-80  mb-10 bg-green-200"
                >
                  <CardHeader>
                    <p className="text-4xl">{product.name}</p>
                  </CardHeader>
                  <CardContent className=" h-60">
                    <div className="relative h-full">
                      <div className="absolute inset-0 ">
                        <ProductDescriptionComponent
                          productId={product.id}
                          descriptions={product.description} // Typecast the descriptions prop to the correct type
                        />
                      </div>
                      <div className="absolute right-4 bottom-4 gap-4 z-20 p-2">
                        <div className="flex flex-row gap-4">
                          <Link
                            href={`/dashboard/marketplace/product/${product.id}`}
                          >
                            {t("ProductEntryDetail")}
                          </Link>
                          <Link
                            href={`/dashboard/marketplace/product/${product.id}`}
                          >
                            {t("ProductEntryTips")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-row gap-4">
                      {productSubs!.map((productSubscription) => {
                        console.log("package:", productSubscription);

                        return (
                          <div
                            className="bg-blue-200"
                            key={productSubscription?.name ?? "undefined"}
                          >
                            {productSubscription?.name ?? "No Subscription"}
                          </div>
                        );
                      })}
                    </div>
                  </CardFooter>
                  <Separator className="my-4" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
