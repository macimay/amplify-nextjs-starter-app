import { generateClient } from "aws-amplify/api";
import AssetPackage from "./AssetPackage";
import { Schema } from "../../amplify/data/resource";
import { useTeamContext } from "./TeamContext";

export class Subscriptions {
  loading: boolean = true;
  assetPackages: AssetPackage[] = [];

  constructor(assetPackages: AssetPackage[]) {
    this.assetPackages = assetPackages;
  }

  async load(): Promise<void> {
    const { session } = useTeamContext();
    this.loading = true;
    const client = generateClient<Schema>({ authMode: "apiKey" });
    client.models.SubscriptionPool.observeQuery({
      filter: {
        teamId: { eq: session.relation.teamId },
      },
    }).subscribe((result) => {
      this.assetPackages = result.items.map((ap) =>
        AssetPackage.fromServerData(ap)
      );
    });

    this.loading = false;
  }
  consumeAsset(productId: string, count: number): boolean {
    const assetPackage = this.assetPackages.find(
      (ap) => ap.productId === productId
    );
    if (!assetPackage) {
      return false;
    }
    if (assetPackage.capacity < count) {
      return false;
    }
    assetPackage.capacity -= count;
    return true;
  }
}
