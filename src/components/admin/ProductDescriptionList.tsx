import { Schema } from "@/../amplify/data/resource";
import S3Image from "../S3Image";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { generateClient } from "aws-amplify/api";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ProductDescriptionList({
  productionId,
}: {
  productionId: string;
}) {
  const [descriptions, setDescriptions] = useState<
    Schema["ProductDescription"][]
  >([]);
  useEffect(() => {
    console.log("ProductDescriptionList useEffect productId:", productionId);
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.ProductDescription.list({
      filter: {
        productDescriptionId: {
          eq: productionId,
        },
      },
    }).then(({ data: data, errors }) => {
      if (errors) {
        console.error("Error:", errors);
        return;
      }
      setDescriptions(data);
    });
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <p className="text-2xl font-bold">Product Description</p>

        <Link href={`/admin/products//description/${productionId}/`}>
          <PlusIcon width={24} />
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>publish</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {descriptions.map((description) => (
            <TableRow key={description.id}>
              <TableCell>{description.id.substring(0, 8)}</TableCell>
              <TableCell>{description.description}</TableCell>
              <TableCell>
                <S3Image
                  imageKey={description.imageKey}
                  key="imageUrl"
                  width={32}
                />
              </TableCell>
              <TableCell>
                <Switch checked={description.publish} onChange={() => {}} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/products/description/${productionId}/${description.id}`}
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
