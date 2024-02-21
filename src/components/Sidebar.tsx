"use client";
export class EntryItem {
  key: string;
  title: string;
  icon: string;
  path: string;
  children?: EntryItem[];
  constructor(
    key: string,
    title: string,
    icon: string,
    path: string,
    children?: EntryItem[]
  ) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.path = path;

    this.children = children;
  }
}

export default function Sidebar({
  items,
  onItemChanged,
}: {
  items: EntryItem[];
  onItemChanged: (item: EntryItem) => void;
}) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.key} onClick={() => onItemChanged(item)}>
          <div>{item.icon}</div>
          <div>{item.title}</div>

          {item.children && (
            <Sidebar items={item.children} onItemChanged={onItemChanged} />
          )}
        </div>
      ))}
    </div>
  );
}
