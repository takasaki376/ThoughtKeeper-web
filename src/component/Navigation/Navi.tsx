"use client";

import cc from "classcat";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";


const items = [
  { href: "/top", label: "Top" },
  { href: "/ThemeSelect", label: "ThemeSelect" },
  { href: "/setting", label: "Setting" },
  { href: "/setting/privacy", label: "Privacy" },
  { href: "/MemoEditor", label: "MemoEditor" },
  { href: "/MemoList", label: "MemoList" },
  { href: "/MemoViewer", label: "MemoViewer" },
] as const;

/**
 * @package
 */
export const Navigation: FC = () => {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col items-start text-gray">
        {items.map(({ href, label }) => {
          const activeColorClass = cc([
            "inline-block p-4",
            {
              "text-black": pathname === href!,
              "text-tomato": pathname === href,
            },
          ]);
          return (
            <Link href={href} key={label}>
              <span className={activeColorClass}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
