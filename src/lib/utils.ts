import { useTeamContext } from "@/components/TeamContext";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTeamAdmin() {
  const { session } = useTeamContext();
  if (!session || !session.teamMember) {
    return false;
  }
  return session.teamMember.role === "admin";
}
