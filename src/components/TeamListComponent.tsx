import { useEffect, useState } from "react";
import { loginStatus } from "./LoginStatus";
import { SelectionSet, generateClient } from "aws-amplify/api";
import { Schema } from "@/../amplify/data/resource";

import { useTeamContext } from "./TeamContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export default function TeamListComponent({
  callback,
}: {
  callback: (team: any) => void;
}) {
  console.log("team list component");
  const selectionSet = ["userId", "team.id", "team.name"] as const;
  type TeamListPackage = SelectionSet<
    Schema["TeamMember"],
    typeof selectionSet
  >;
  const [teamList, setTeamList] = useState<TeamListPackage[]>([]);
  const { session } = useTeamContext();

  useEffect(() => {
    if (session == null) {
      console.log("TeamListComponent:session is null");
      return;
    }
    const client = generateClient<Schema>({
      authMode: "apiKey",
    });

    console.log("TeamListComponent:userId", session.userId);
    client.models.TeamMember.list({
      filter: {
        userId: { eq: session.userId },
      },
      selectionSet: selectionSet,
    }).then((teams) => {
      console.log("teams:", teams);
      setTeamList(teams.data);
    });
  }, []);

  return (
    <div>
      <Command aria-label="Team List">
        <CommandGroup>
          {teamList.map((team) => (
            <CommandItem
              key={team.team.id}
              value={team.team.id}
              onSelect={(currentValue) => {
                console.log("team selected:", currentValue);
                callback(currentValue);
              }}
            >
              {team.team.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
}
