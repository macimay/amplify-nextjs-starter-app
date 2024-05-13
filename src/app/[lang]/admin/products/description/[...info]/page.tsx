"use client";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { ProductDescriptionType } from "@/type/ProductDescriptionType";
import DetailForm from "@/components/admin/DetailForm";
import { Separator } from "@/components/ui/separator";
import { uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { nullable } from "zod";
import { useEffect, useState } from "react";

export default function ProductDescriptionPage({
  params,
}: {
  params: { info: string[] };
}) {
  console.log("ProductDescriptionPage params:", params);
  const [description, setDescription] = useState<ProductDescriptionType>();
  // let description: ProductDescriptionType;

  useEffect(() => {
    console.log("ProductDescriptionPage useEffect:", params.info.length);
    if (params.info.length == 2) {
      console.log("get description");
      const client = generateClient<Schema>({
        authMode: "apiKey",
      });
      client.models.ProductDescription.get({
        id: params.info[1],
      }).then((result) => {
        console.log("result:", result);
        setDescription(
          ProductDescriptionType.fromProductDescription(result.data)
        );
      });
    } else {
      console.log("create new description");
      setDescription(ProductDescriptionType.createEmpty());
    }
    console.log("description:", description);
  }, []);

  const router = useRouter();

  // Access the parameters from the router query

  return (
    <>
      <div className="flex flex-col">
        <div>
          {params.info[0] ? (
            <p className="4xl-text">编辑介绍信息2</p>
          ) : (
            <p className="4xl-text">新建介绍信息1</p>
          )}
        </div>
        <Separator className="my-4" />

        <div>
          <DetailForm
            data={description!}
            onSubmitCallback={async (values) => {
              console.log("values:", values);
              const client = generateClient<Schema>({ authMode: "apiKey" });
              let imageKey = description?.imageKey;
              if (values.imageKey) {
                const iconKey = uuidv4();
                const result = await uploadData({
                  key: iconKey,
                  data: values.imageKey,
                }).result;
                imageKey = result.key;
              }

              if (params.info[1]) {
                client.models.ProductDescription.update({
                  id: params.info[1],
                  description: values.description,
                  imageKey: imageKey,
                  publish: values.publish,
                  region: values.region,
                }).then((result) => {
                  console.log("result:", result);
                  router.replace(`/admin/products/detail/${params.info[0]}`);
                });
              } else {
                client.models.ProductDescription.create({
                  description: values.description,
                  imageKey: imageKey,
                  publish: values.publish,
                  region: values.region,
                  productId: params.info[0],
                  order: 0,
                }).then((result) => {
                  console.log("result:", result);
                  router.replace(`/admin/products/detail/${params.info[0]}`);
                });
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
