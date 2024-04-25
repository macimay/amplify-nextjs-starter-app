"use client";
import { use, useEffect, useState } from "react";
import { type Schema } from "@/../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import UserListComponent, {
  User,
  UserStatus,
} from "@/components/UserListComponent";
import UserDetailComponent from "@/components/UserDetailComponent";
import { loginStatus } from "@/components/LoginStatus";

import { useTeamContext } from "@/components/TeamContext";

export default function OrderPage() {
  const { session } = useTeamContext();
  const [orderList, setOrderList] = useState<Schema["SubscriptionOrder"][]>([]);
  useEffect(() => {}, []);
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col">
        <h1>Order</h1>
        {orderList.map((order) => (
          <div key={order.id}>
            <p>{order.id}</p>
            <p>{order.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
