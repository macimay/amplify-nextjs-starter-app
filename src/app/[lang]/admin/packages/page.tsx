"use client";
import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource"; // Import the Schema object from the appropriate module
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
import { generateClient } from "aws-amplify/api";
import { ConsoleLogger } from "aws-amplify/utils";

export default function PackagePage() {
  const [packages, setPackages] = useState<Schema["ProductPackage"][]>([]); // Add the missing type annotation for the state variable
  const [pageNo, setPageNo] = useState<number>(1);
  const client = generateClient<Schema>({ authMode: "apiKey" });
  var savedToken: string | null | undefined = null;

  useEffect(() => {
    client.models.ProductPackage.list({
      limit: 10,
      nextToken: savedToken,
    }).then(({ data: data, nextToken, errors }) => {
      console.log("nextToken:", savedToken);
      console.log("data:", data);
      savedToken = nextToken;
      setPackages(data); // Set the state variable to the list of packages
    });
  }, [pageNo]); // Add an empty dependency array to the useEffect hook
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col justify-center items-center">
        <Button as={Link} href="/admin/packages/detail/">
          新建收费包
        </Button>
        <Table aria-label="Packages of Product">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>

          <TableBody>
            {packages.map((productPackage) => (
              <TableRow key={productPackage.id}>
                <TableCell>{productPackage.id}</TableCell>
                <TableCell>{productPackage.name}</TableCell>
                <TableCell>{productPackage.price}</TableCell>
                <TableCell>
                  <Button
                    as={Link}
                    href={`/admin/packages/detail/${productPackage.id}`}
                  >
                    编辑
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          total={10}
          initialPage={1}
          showControls
          onChange={(no) => {
            setPageNo(no);
          }}
        />
      </div>
    </div>
  );
}
