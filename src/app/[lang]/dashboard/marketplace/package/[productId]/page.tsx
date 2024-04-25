// import { useRouter } from "next/router";
"use client";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import ProductPageDetailComponent from "@/components/ProductDescriptionComponent";
import CheckoutComponent from "@/components/CheckoutComponent";

export default function ProductPackagePage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const [product, setProduct] = useState<Schema["ProductPackage"]>();
  // const router = useRouter();
  useEffect(() => {
    console.log("ProductPackagePage useEffect productId: ", productId);
    const client = generateClient<Schema>();
    client.models.ProductPackage.get({
      id: productId,
    }).then((productPackage): void => {
      console.log("productPackage:", productPackage);
      setProduct(productPackage.data);
    });
  }, [productId]);

  return (
    <div className="flex flex-row">
      {product && (
        <ProductPageDetailComponent
          productId={product.id}
          descriptions={product.description!}
        />
      )}

      <div>{product && <CheckoutComponent product={product} />}</div>
    </div>
  );
}
