import { TeamMemberType } from "@/type/TeamMemberType";
import DetailForm from "./admin/DetailForm";
import { Button } from "./ui/button";

export default function TeamMemberComponent({
  member,
  edit,
}: {
  member: any;
  edit: boolean;
}) {
  if (edit) {
    const memberData = TeamMemberType.fromMember(member);
    return (
      <DetailForm
        data={memberData}
        onSubmitCallback={function (values: { [x: string]: any }): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  } else {
    return (
      <div>
        <div className="flex flex-col h-full w-full ml-20 mt-20">
          <div className="text-4xl">{member.name}</div>
          <div>{member.status}</div>
        </div>
        <div className="flex flex-row w-full justify-center">
          <Button>Save</Button>
        </div>
      </div>
    );
  }
} //
