"use client";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductPackageType } from "@/type/ProductPackageType";
import DetailForm from "@/components/admin/DetailForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { z } from "zod";
import Link from "next/link";

export default function DetailPage({
  params,
}: {
  params: { packageId: string | null };
}) {
  // const [productPackage, setProductPackage] =
  //   useState<Schema["ProductPackage"]>();
  const [productPackage, setProductPackage] = useState<ProductPackageType>();

  useEffect(() => {
    console.log("DetailPage useEffect packageId: ", params.packageId);
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });
    if (params.packageId !== undefined) {
      const packageId = params.packageId?.[0] ?? null;
      if (packageId !== null) {
        client.models.ProductPackage.get({
          id: packageId,
        }).then((productPackage): void => {
          console.log("productPackage:", productPackage);
          setProductPackage(
            ProductPackageType.fromProductPackage(productPackage.data)
          );
        });
      }
    } else {
      setProductPackage(ProductPackageType.createEmpty());
    }
  }, []);

  const keys = Object.keys(productPackage || {});
  const save = () => {
    console.log("save productPackage:", productPackage);
  };
  const create = () => {
    console.log("create productPackage:", productPackage);
  };

  return (
    <>
      <div
        className="flex flex-col w-[720px] flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 items-start"
        key="product"
      >
        <Button variant="ghost" className="w-32" asChild>
          <Link href="/admin/packages">返回</Link>
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {params.packageId && <h1>编辑产品费用包</h1>}
              {!params.packageId && <h1>新建产品费用包</h1>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productPackage && (
              <DetailForm
                data={productPackage!}
                submit={(values: z.infer<z.ZodObject<any, any>>) => {
                  console.log("page submit productPackage:", values);
                }}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {params.packageId && <Button>保存</Button>}
            {!params.packageId && (
              <Button
                onClick={() => {
                  create();
                }}
              >
                创建
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
