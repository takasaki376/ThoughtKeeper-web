import type { FC } from "react";

import { NavLink } from "./NavLink";

const items = [
  { href: "/top", label: "Top" },
  { href: "/ThemeSelect", label: "ThemeSelect" },
  { href: "/setting", label: "Setting" },
  { href: "/setting/privacy", label: "Privacy" },
  { href: "/MemoEditor", label: "MemoEditor" },
  { href: "/MemoList", label: "MemoList" },
  { href: "/MemoViewer", label: "MemoViewer" },
];

/**
 * @package
 */
export const Navigation: FC = () => {
  return (
    <div>
      <nav className="flex flex-col items-start text-gray">
        {items.map(({ href, label }) => {
          return (
            <NavLink key={href} href={href} activeClassName="text-tomato/40">
              <div className="inline-block p-4">{label}</div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
