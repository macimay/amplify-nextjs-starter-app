import Link from "next/link";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  return (
    <div
      className="flex flex-col w-full h-full  justify-start items-center"
      aria-label="SideBar"
    >
      <ul>
        <li>
          <Link href="/admin/products">产品管理</Link>
        </li>
        <li>
          <Link key="package" href="/admin/packages">
            收费包管理
          </Link>
        </li>
        <li>
          <Link href="/admin/subscriptions">订阅管理</Link>
        </li>
        <li>
          <Link href="/admin/teams">团队管理</Link>
        </li>
        <li>
          <Link href="/admin/users">用户管理</Link>
        </li>
      </ul>
    </div>
  );
}
