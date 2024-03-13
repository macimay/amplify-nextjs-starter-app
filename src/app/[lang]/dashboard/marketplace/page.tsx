"use client";
import { Schema } from "@/../amplify/data/resource";

import { TagWrapper, useTagContext } from "@/components/TagContext";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spacer,
} from "@nextui-org/react";
import { SelectionSet, generateClient } from "aws-amplify/api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTeamContext } from "@/components/TeamContext";

const DynamicComponentLoader = ({
  componentName,
}: {
  componentName: string;
}) => {
  const [Component, setComponent] = useState<React.ComponentType | undefined>();

  useEffect(() => {
    const loadComponent = async () => {
      const component = await import(`./components/${componentName}`);
      console.log("component:", component);
      setComponent(() => component.default);
    };

    loadComponent();
  }, [componentName]);

  if (!Component) return <div>Loading component...</div>;
  return <Component />;
};

export default function ModelHomePage() {
  const router = useRouter();
  const { tagSelected, setTagSelected } = useTagContext();
  const { session } = useTeamContext();

  const selectionSet = ["id", "name", "shortName", "package.*"] as const;
  type ProductWithPackage = SelectionSet<
    Schema["Product"],
    typeof selectionSet
  >;
  const client = generateClient<Schema>();
  const [products, setProducts] = useState<ProductWithPackage[]>([]);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const { data: products } = await client.models.Product.list({
      filter: {
        isPublished: { eq: true }, // Fix: Use the correct type for the 'isPublished' property
      },
      selectionSet: selectionSet,
    });
    console.log("products:", products);
    setProducts(products); // Update the type of products
  };
  const createProduct = () => {
    client.models.Product.create({
      name: "Stable Diffusion",
      shortName: "stableDiffusion",
      isPublished: true,
    }).then((product): void => {
      console.log("product:", product);
      fetchProducts();
    });
  };
  const createPricePackage = async (productId: string) => {
    const { data: pricePackage, errors: createError } =
      await client.models.ProductPackage.create({
        name: "New PricePackage",
        productPackageId: productId,
        price: 100,
        isExpired: "NEVER",
        currency: "USD",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    if (createError) {
      console.log("createError:", createError);
    }

    // const { data: product, errors: updateError } =
    // await client.models.Product.update({
    //   id: productId,
    //   pricePackage: pricePackage.id, // Fix: Provide the valid string value for the 'connect' property
    // });
    // if (updateError) {
    //   console.log("updateError:", updateError);
    // }
    // console.log("product:", product);
  };
  const addToWorkspace = async (packageId: string) => {
    console.log("add to  workspace:", packageId);
    const { data: order, errors: orderError } =
      await client.models.TeamProductPool.create({
        teamId: session.relation.team.id,
        teamProductPoolPackageId: packageId,
        priority: 0,
        used: 0,
        count: 100,
        status: "ACTIVE",
        period: "MONTH",
        startAt: new Date().toISOString(),
        expireAt: new Date().toISOString(),
      });
    console.log("added to workspace:", order);
  };

  return (
    <div className="container flex flex-col items-between bg-green-200">
      <div className="container list-disc list-inside  gap-4 justify-items-center ">
        {products.map((product) => (
          <Card key={product.id} className="w-full h-80 bg-blue-200 mb-10">
            <CardHeader>
              <div className="flex flex-col">
                <Divider />
                <p className="text-4xl">{product.name}</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-row justify-between">
                <DynamicComponentLoader componentName={product.shortName} />
                <div className="max-h-64 overflow-y-auto">
                  {product.package.map((pkg) => (
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
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-row">
                <Button
                  variant="light"
                  onClick={() => {
                    console.log("add to workspace:", product.id);
                    addToWorkspace(product.package[0].id!);
                  }}
                >
                  add
                </Button>
                <Button variant="light">try</Button>
                <Button
                  variant="light"
                  onPress={() => {
                    addToWorkspace(product.package[0].id!);
                  }}
                >
                  test
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Spacer y={2} />
      <div className="flex flex-row gap-10">
        <Button
          onClick={() => {
            console.log("createProduct");
            createProduct();
          }}
        >
          New Product
        </Button>
      </div>
    </div>
  );
}
