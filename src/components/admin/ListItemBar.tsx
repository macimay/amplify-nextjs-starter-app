import Link from "next/link";
import { Button } from "../ui/button";

export default function ListItemBar({ newUrl }: { newUrl: string }) {
  return (
    <div className="flex flex-col">
      <Button asChild>
        <Link href={newUrl}>新增</Link>
      </Button>
    </div>
  );
}
