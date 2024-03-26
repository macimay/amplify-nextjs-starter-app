"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import { List } from "lucide-react";
import ListItemBar from "@/components/admin/ListItemBar";
import S3Image from "@/components/S3Image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Schema["Product"][]>([]);
  var savedToken: string | null | undefined = null;
  useEffect(() => {
    console.log("ProductsPage useEffect called");
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.Product.list({
      limit: 10,
      nextToken: savedToken,
    }).then(({ data: data, nextToken, errors }) => {
      console.log("products:", products);
      if (errors) {
        console.error("Error:", errors);
        return;
      }
      savedToken = nextToken;
      setProducts(data);
    });
  }, []);
  return (
    <div className="flex flex-col w-full h-full">
      <ListItemBar newUrl="/admin/products/detail" />
      <div className="flex flex-col">
        <Table aria-label="Products">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id.substring(0, 8)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <S3Image
                    s3Key={product.icon}
                    key={product.id}
                    width={24}
                    height={24}
                  />
                </TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href={`/admin/products/detail/${product.id}`}>
                      编辑
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
