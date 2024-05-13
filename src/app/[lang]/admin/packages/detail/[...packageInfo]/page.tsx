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
import { useRouter } from "next/navigation";

export default function DetailPage({
  params,
}: {
  params: { packageInfo: string[] };
}) {
  // const [productPackage, setProductPackage] =
  //   useState<Schema["ProductPackage"]>();
  console.log("DetailPage params:", params);
  const [productPackage, setProductPackage] = useState<ProductPackageType>();
  const editMode: boolean = params.packageInfo.length === 2;
  const router = useRouter();

  useEffect(() => {
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });
    if (editMode) {
      const packageId = params.packageInfo?.[1] ?? null;
      if (packageId !== null) {
        client.models.ProductPackage.get({
          id: packageId,
        }).then((productPackage): void => {
          console.log("productPackage:", productPackage);
          setProductPackage(
            ProductPackageType.fromProductPackage(productPackage.data)
          );
        });
      } else {
        console.log("packageId is null");
      }
    } else {
      setProductPackage(ProductPackageType.createEmpty(params.packageInfo[0]));
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
        key="productPackage"
      >
        <Button variant="ghost" className="w-32" asChild>
          <Link href="/admin/packages">返回</Link>
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {editMode && <p>编辑产品费用包</p>}
              {!editMode && <p>新建产品费用包</p>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productPackage && (
              <DetailForm
                key="productPackageForm"
                data={productPackage!}
                onSubmitCallback={(values: z.infer<z.ZodObject<any, any>>) => {
                  console.log("page submit productPackage:", values);
                  const client = generateClient<Schema>({ authMode: "apiKey" });
                  if (values.id.length == 0) {
                    //create new package
                    client.models.ProductPackage.create({
                      name: values.name,

                      count: values.count,
                      unit: values.unit,
                      description: values.description,

                      productId: values.productId,

                      region: values.region,
                      isExpire: values.expireInfo.isExpire,
                      availableAt: values.expireInfo.availableAt,
                      expireAt: values.expireInfo.expireAt,
                      expireInDays: values.expireInfo.expireInDays,
                    }).then((newPackage): void => {
                      console.log("new package:", newPackage);

                      router.back();
                      //router.replace(`/admin/packages/detail/${newPackage.data.id}`);
                    });
                  } else {
                    //update package
                    client.models.ProductPackage.update({
                      id: values.id,
                      name: values.name,

                      count: values.count,
                      unit: values.unit,
                      description: values.description,

                      productId: values.productId,

                      region: values.region,
                      isExpire: values.expireInfo.isExpire,
                      availableAt: values.expireInfo.availableAt,
                      expireAt: values.expireInfo.expireAt,
                      expireInDays: values.expireInfo.expireInDays,
                    }).then((updatedPackage): void => {});
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
