"use server";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
import { cookieBasedClient } from "@/server/amplifyCookieClient";
import { getProductUsageByPackage } from "@/server/packageUtils";

export async function subscribe(teamId: string, subscriptionId: string) {
  const userBrief = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });

  //get subscription detail
  const subscription = await cookieBasedClient.models.Subscriptions.get({
    id: subscriptionId,
  });
  if (subscription == null) {
    console.log("Subscription not found");
    throw {
      error: "SubscriptionNotFound",
      message: `Subscription not found: ${subscriptionId}`,
    };
  }
  console.log(subscription);
  //create subscription pool items
  const { data: productPackages } = await subscription.data.packages();

  productPackages.forEach(async (packageDetail) => {
    console.log("package:", packageDetail);
    const poolInfo = await getProductUsageByPackage(packageDetail, new Date());
    const { data: subscriptionPool, errors: error } =
      await cookieBasedClient.models.SubscriptionPool.create({
        teamSubscriptionsId: teamId,
        subscriptionPoolSubscriptionId: subscriptionId,
        subscriptionPoolPackageId: packageDetail.id,
        priority: subscription.data.priority,
        periodicStart: poolInfo.start.toISOString(), // Convert date to string
        periodicEnd: poolInfo.end?.toISOString() ?? undefined,
        capacity: poolInfo.amount,
        used: 0,
        status: "ACTIVE",
      });
    if (error) {
      console.log("create pool error", error);
    }
  });

  //create subscription history
  const startDate = new Date();
  const expireDate = new Date();
  expireDate.setDate(
    startDate.getDate() + (subscription.data.expireInDays ?? 0)
  );
  const { data: subscriptionHistory, errors: error } =
    await cookieBasedClient.models.TeamSubscriptions.create({
      teamSubscriptionsTeamId: teamId,
      teamSubscriptionsSubscriptionId: subscriptionId,

      availableAt: startDate.toISOString(),

      expireAt: expireDate.toISOString(),
      priority: subscription.data.priority,
    });

  console.log("subscription team :", startDate.toISOString(), error);
  return {
    teamId,
    subscriptionId,
  };
}

export async function trial(teamId: string, subscriptionId: string) {}
export async function purchase(
  teamId: string,
  subscriptionId: string,
  price: number,
  currency: string
) {
  console.log("purchase", teamId, subscriptionId, price, currency);
  try {
    return subscribe(teamId, subscriptionId);
  } catch (e) {
    console.log(e);
  }
}
