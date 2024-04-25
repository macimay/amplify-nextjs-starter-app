"use client";
import { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileTerminalIcon } from "lucide-react";

export default function PackageListComponent({
  filterType,
  filterValue,
}: {
  filterType: "byRegion" | "byProduct";
  filterValue: string;
}) {
  const [packages, setPackages] = useState<Schema["ProductPackage"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("PackageListComponent useEffect productId:", filterValue);
    async function fetchPackagesByProduct(productId: string) {
      const client = generateClient<Schema>({ authMode: "apiKey" });
      try {
        client.models.ProductPackage.list({
          filter: {
            productPackagesId: {
              eq: productId,
            },
          },
        }).then(({ data: data, errors }) => {
          if (errors) {
            console.error("Error:", errors);
            return;
          }
          setPackages(data);
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    async function fetchPackagesByRegion(region: string) {
      const client = generateClient<Schema>({ authMode: "apiKey" });
      try {
        client.models.ProductPackage.list({
          filter: {
            region: {
              eq: region,
            },
          },
        }).then(({ data: data, errors }) => {
          if (errors) {
            console.error("Error:", errors);
            return;
          }
          setPackages(data);
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    if (filterType === "byRegion") {
      fetchPackagesByRegion(filterValue);
    } else if (filterType === "byProduct") {
      fetchPackagesByProduct(filterValue);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log("packages:", packages);

  return (
    <Table aria-label="Packages of Product">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>

          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="w-32">{p.id.substring(0, 8)}</TableCell>
            <TableCell>{p.name}</TableCell>

            <TableCell>
              <Link
                href={{
                  pathname: `/admin/packages/detail/${filterValue}/${p.id}`,
                }}
              >
                编辑
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
