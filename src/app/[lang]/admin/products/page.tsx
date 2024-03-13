"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Link,
} from "@nextui-org/react";
import { List } from "lucide-react";
import ListItemBar from "@/components/admin/ListItemBar";

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
            <TableColumn>ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Icon</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.icon}</TableCell>
                <TableCell>
                  <Button
                    as={Link}
                    href={`/admin/products/detail/${product.id}`}
                  >
                    编辑
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
