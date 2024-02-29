import { useEffect, useState } from "react";
import { loginStatus } from "./LoginStatus";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useTeamContext } from "./TeamContext";

export default function TeamListComponent({
  callback,
}: {
  callback: (team: any) => void;
}) {
  const [teamList, setTeamList] = useState<Schema["Team"][]>([]);
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
      selectionSet: ["team.*", "team.admin.*"],
    }).then((teams) => {
      console.log("teams:", teams);
      setTeamList(
        teams.data.map((team) => ({
          ...team.team,
          admin: team.team.admin as any, // Update the type of the admin property
        }))
      );
    });
  }, []);

  return (
    <div>
      <Listbox aria-label="Team List" items={teamList}>
        {(team) => (
          <ListboxItem
            key={team.id}
            value={team.id}
            onClick={() => {
              console.log("team:", team);
              callback(team);
            }}
          >
            {team.name}
          </ListboxItem>
        )}
      </Listbox>
    </div>
  );
}
