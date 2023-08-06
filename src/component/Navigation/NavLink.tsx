"use client"
import type {LinkRestProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { cloneElement } from "react";
import { UrlObject } from "url";

// TBD:RouteImpl<any>の型定義
type LinkProps = LinkRestProps & {
    href: __next_route_internal_types__.RouteImpl<any> | UrlObject;
}
type Props = LinkProps & { activeClassName: string; children: ReactElement };

/**
 * @package
 */
export const NavLink: React.FC<Props> = ({
  activeClassName,
  children,
  ...linkProps
}) => {
  const router = usePathname()
  console.log(`router === ${router}`)

  return (
    <Link {...linkProps}>
      {cloneElement(children, {
        className:
          router === linkProps.href
            ? `${activeClassName} ${children.props.className ?? ""}`
            : children.props.className ?? "",
      })}
    </Link>
  );
};
