import { Input, Button, Image } from "@nextui-org/react";
import { useState } from "react";

export type UpdateProfileItemFunc = (
  key: string,
  value: string
) => Promise<{ result: boolean; updateValue: string }>;

export function ProfileItem({
  name,
  label,
  value,
  callback,
  readonly = false,
}: {
  name: string;
  label: string;
  value: string;
  callback: UpdateProfileItemFunc;
  readonly?: boolean;
}) {
  const [content, setContent] = useState(value);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
    console.log(event.target.value);
  }

  const [editMode, setEditMode] = useState<
    "normal" | "updating" | "editing" | "done"
  >("normal");
  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="w-1/3 ml-4">{label}:</div>
      <div className="w-2/3 flex flex-row justify-start items-center ">
        {!readonly && editMode === "editing" ? (
          <Input type="text" value={content} onChange={handleChange} />
        ) : (
          <div>{value}</div>
        )}

        {editMode === "editing" && (
          <div className="flex flex-row">
            <Image
              src="/assets/picture/check-mark.png"
              width={24}
              height={24}
              alt="save"
              onClick={async () => {
                setEditMode("updating");
                callback(name, content).then((result) => {
                  console.log("result:", result);
                  if (result) {
                    setEditMode("normal");
                  } else {
                    setEditMode("editing");
                  }
                });
              }}
            />

            <Image
              src="/assets/picture/close.png"
              width={24}
              height={24}
              alt="cancel"
            />
          </div>
        )}
        {!readonly && editMode == "normal" && (
          <Image
            src="/assets/picture/edit.png"
            width={24}
            height={24}
            alt="edit"
            onClick={() => {
              setEditMode("editing");
            }}
          />
        )}
        {!readonly && editMode === "updating" && <div>Updating...</div>}
      </div>
    </div>
  );
}
