import { useEffect, useState } from "react";
import { loginStatus } from "./LoginStatus";
import { SelectionSet, generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useTeamContext } from "./TeamContext";

export default function TeamListComponent({
  callback,
}: {
  callback: (team: any) => void;
}) {
  const selectionSet = ["team.*", "team.admin.*"] as const;
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

    console.log("TeamListComponent:userId", session.relation?.user.id);
    client.models.TeamMember.list({
      filter: { teamMemberUserId: { eq: session.relation?.user.id } },
      selectionSet: selectionSet,
    }).then((teams) => {
      console.log("teams:", teams);
      setTeamList(teams.data);
    });
  }, []);

  return (
    <div>
      <Listbox aria-label="Team List" items={teamList}>
        {(team) => (
          <ListboxItem
            key={team.team.id}
            value={team.team.id}
            onClick={() => {
              console.log("team selected:", team);
              callback(team.team);
            }}
          >
            {team.team.name}
          </ListboxItem>
        )}
      </Listbox>
    </div>
  );
}
