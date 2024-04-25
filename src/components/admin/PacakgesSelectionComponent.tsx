"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import { useEffect, useState } from "react";
import { SelectionSet, generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { sub } from "date-fns";
import { SelectArrow } from "@radix-ui/react-select";
import { Minus, Subscript } from "lucide-react";
const selectionSet = [
  "id",
  "name",
  "product.*",
  "description",
  "region",
] as const;
export type PackageSelectionSet = SelectionSet<
  Schema["ProductPackage"],
  typeof selectionSet
>;

export default function PackagesSelectionComponent({
  mode,
  subscriptionId,

  filterType,
  filterValue,
  onSubmitCallback,
}: {
  mode: "add" | "remove";
  subscriptionId: string;
  filterType: string;
  filterValue: string;
  onSubmitCallback: (packages: PackageSelectionSet[]) => void;
}) {
  const [packages, setPackages] = useState<PackageSelectionSet[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<
    PackageSelectionSet[]
  >([]);
  useEffect(() => {
    console.log("packagesSelected:", mode, " ", subscriptionId);
    console.log("filterType:", filterType, "filter value:", filterValue);
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.ProductPackage.list({
      filter: {
        [filterType]: { eq: filterValue },
        subscriptionsPackagesId:
          mode === "add" ? { ne: subscriptionId } : { eq: subscriptionId },
      },
      selectionSet: ["id", "name", "product.*", "description", "region"],
    }).then((data) => {
      console.log("packages for :", filterType, filterValue, data.data);

      setPackages(data.data);
    });
  }, []);
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          {mode == "add" ? <PlusIcon width={24} /> : <MinusIcon width={24} />}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode} Packages to Subscription</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Package Name</TableCell>
                <TableCell>Product</TableCell>

                <TableCell>Description</TableCell>
                <TableCell>Region</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((p) => {
                return (
                  <TableRow
                    key={p.id}
                    data-state={
                      selectedPackages.includes(p) ? "selected" : "unselected"
                    }
                    onClick={() => {
                      if (selectedPackages.includes(p)) {
                        setSelectedPackages((prev) =>
                          prev.filter((item) => item.id !== p.id)
                        );
                      } else {
                        setSelectedPackages((prev) => [...prev, p]);
                      }
                    }}
                  >
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.product.name}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.region}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button
              onClick={() => {
                console.log("packageIds:", packages);
                onSubmitCallback(packages);
              }}
            >
              {mode}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
