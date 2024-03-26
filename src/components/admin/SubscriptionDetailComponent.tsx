import { Schema } from "@/../amplify/data/resource";

export default function SubscriptionDetailComponent({
  subscription,
}: {
  subscription: Schema["Subscriptions"];
}) {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col">
        <h1>{subscription.name}</h1>
        <p>Welcome to the subscription detail page</p>
      </div>
    </div>
  );
}
