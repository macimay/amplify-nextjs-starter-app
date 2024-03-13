"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import { uploadData, getUrl } from "aws-amplify/storage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DetailForm from "@/components/admin/DetailForm";
import { ProductType } from "@/type/ProductType";
import { Divide, SeparatorHorizontal } from "lucide-react";
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
import { randomUUID } from "crypto";

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
  const createFunction = (
    id: string,
    values: z.infer<z.ZodObject<any, any>>
  ) => {
    console.log("create product:", id);
    client.models.Product.create({
      name: values["name"],
      shortName: values["shortName"],
      icon: values["icon"],
      publish: values["publish"],
    }).then((product): void => {
      console.log("product:", product);
      router.replace(`/admin/products/detail/${product.data.id}`);
    });
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
                submit={(values: z.infer<z.ZodObject<any, any>>) => {
                  console.log("page submit product:", values);
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
                        }).then((product): void => {
                          console.log("product:", product);
                          router.replace(
                            `/admin/products/detail/${product.data.id}`
                          );
                        });
                      }
                      createFunction(result.key, values);
                    });
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />
      <div>{product?.id && <Button>product exists</Button>}</div>
    </div>
  );
}
