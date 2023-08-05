import type { FC } from "react";
import { pagesPath } from "src/lib/$path";

import { NavLink } from "./NavLink";

const items = [
  { href: pagesPath.top.$url().pathname, label: "Top" },
  { href: pagesPath.ThemeSelect.$url().pathname, label: "ThemeSelect" },
  { href: pagesPath.setting.$url().pathname, label: "Setting" },
  { href: pagesPath.setting.privacy.$url().pathname, label: "Privacy" },
  { href: pagesPath.MemoEditor.$url().pathname, label: "MemoEditor" },
  { href: pagesPath.MemoList.$url().pathname, label: "MemoList" },
  { href: pagesPath.MemoViewer.$url().pathname, label: "MemoViewer" },
];

/**
 * @package
 */
export const Navigation: FC = () => {
  return (
    <div>
      <nav className="flex flex-col items-start text-gray-500">
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
