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
  const { session } = useTeamContext();

  const selectionSet = [
    "id",
    "name",
    "shortName",
    "packages.*",
    "description.*",
  ] as const;
  type ProductWithPackage = SelectionSet<
    Schema["Product"],
    typeof selectionSet
  >;
  const client = generateClient<Schema>();
  const [products, setProducts] = useState<ProductWithPackage[]>([]);
  useEffect(() => {
    client.models.Product.list({
      filter: {
        publish: { eq: true },
        // Fix: Use the correct type for the 'isPublished' property
      },
      selectionSet: selectionSet,
    }).then((data) => {
      setProducts(data.data);
      console.log("products:", data.data);
    });
  }, []);

  return products.length === 0 ? (
    <LoadingComponent />
  ) : (
    <>
      <div className="container flex flex-col items-between bg-green-200">
        <div className="container list-disc list-inside  gap-4 justify-items-center ">
          {products.map((product) => (
            <Card key={product.id} className="w-full h-80 bg-blue-200 mb-10">
              <CardHeader>
                <div className="flex flex-col">
                  <Separator className="my-4" />
                  <p className="text-4xl">{product.name}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col justify-between">
                  <ProductDescriptionComponent
                    descriptions={product.description} // Typecast the descriptions prop to the correct type
                  />
                  <div className="max-h-64 overflow-y-auto"></div>
                  <div className="flex flex-row">
                    {product.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          router.push(`/dashboard/marketplace/${product.id}`);
                        }}
                      >
                        {pkg.name}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <Separator className="my-4" />
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
