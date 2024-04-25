"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import { uploadData, getUrl } from "aws-amplify/storage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DetailForm from "@/components/admin/DetailForm";
import { ProductType } from "@/type/ProductType";

import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PackageListComponent from "@/components/admin/PackageListComponent";
import ProductDescriptionList from "@/components/admin/ProductDescriptionList";
import { Plus, PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ProductPage({
  params,
}: {
  params: { productId: string | undefined };
}) {
  const client = generateClient<Schema>({ authMode: "apiKey" });

  const [product, setProduct] = useState<ProductType>();

  const router = useRouter();
  useEffect(() => {
    if (params.productId !== undefined) {
      const productId = params.productId?.[0] ?? null;

      client.models.Product.get({
        id: productId,
      }).then((product): void => {
        setProduct(ProductType.fromProduct(product.data));
      });
    } else {
      setProduct(ProductType.createEmpty());
    }
  }, []);
  const handleSubmit = (values: z.infer<z.ZodObject<any, any>>) => {
    if (values["id"].length == 0) {
      //create product
      console.log("create product");
      const iconKey = uuidv4();
      uploadData({
        key: iconKey,
        data: values["icon"],
      }).result.then((result) => {
        console.log("result:", result);
        if (result.key) {
          const client = generateClient<Schema>({
            authMode: "apiKey",
          });
          client.models.Product.create({
            name: values["name"],
            shortName: values["shortName"],
            icon: result.key,
            publish: values["publish"],
          }).then((newProduct): void => {
            console.log("new product:", product);
            router.replace(`/admin/products/detail/${newProduct.data.id}`);
          });
        }
      });
    } else {
      console.log("update product");
      const iconKey = uuidv4();
      uploadData({
        key: iconKey,
        data: values["icon"],
      }).result.then((result) => {
        console.log("result:", result);
        if (result.key) {
          const client = generateClient<Schema>({
            authMode: "apiKey",
          });
          client.models.Product.update({
            id: values["id"],
            name: values["name"],
            shortName: values["shortName"],
            icon: result.key,
            publish: values["publish"],
          }).then((newProduct): void => {
            console.log("update product:", product);
            router.replace(`/admin/products/detail/${newProduct.data.id}`);
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col w-[720px] flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
        key="product"
      >
        <Card>
          <CardHeader>
            <CardTitle>{product?.id ? "Edit" : "Create"} Product</CardTitle>
          </CardHeader>
          <CardContent>
            {product && (
              <DetailForm
                data={product!}
                onSubmitCallback={(values: z.infer<z.ZodObject<any, any>>) => {
                  console.log("page submit product:", values);
                  handleSubmit(values);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />
      <div className="flex flex-row justify-between">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Product Package List
        </h2>
        <Link href={`/admin/packages/detail/${product?.id}`}>
          <PlusIcon size={24} />
        </Link>
      </div>

      {product && (
        <PackageListComponent filterType="byProduct" filterValue={product.id} />
      )}
      {product && <ProductDescriptionList productionId={product.id} />}
    </div>
  );
}
