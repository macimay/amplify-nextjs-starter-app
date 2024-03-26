"use client";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Schema["Subscriptions"][]>(
    []
  );
  useEffect(() => {
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.Subscriptions.list().then((data) => {
      console.log("subscriptions:", data.data);
      setSubscriptions(data.data);
    });
  }, []);
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col container">
        <h1>Subscription</h1>
        <Button asChild>
          <Link href="/admin/subscriptions/detail">New</Link>
        </Button>
        <Table aria-label="Subscriptions">
          <TableHeader>
            <TableRow>
              <TableHead>name</TableHead>
              <TableHead>price</TableHead>
              <TableHead>currency</TableHead>
              <TableHead>capacity</TableHead>
              <TableHead>period</TableHead>
              <TableHead>level</TableHead>
              <TableHead>amount</TableHead>
              <TableHead>region</TableHead>
              <TableHead>publish</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>{subscription.price}</TableCell>
                <TableCell>{subscription.currency}</TableCell>
                <TableCell>{subscription.capacity}</TableCell>
                <TableCell>{subscription.period}</TableCell>
                <TableCell>{subscription.level}</TableCell>
                <TableCell>{subscription.amount}</TableCell>

                <TableCell>{subscription.region}</TableCell>
                <TableCell>{subscription.publish}</TableCell>
                <TableCell>
                  <Link href={`/admin/subscriptions/detail/${subscription.id}`}>
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
