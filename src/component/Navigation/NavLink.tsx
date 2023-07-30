"use client"
import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { cloneElement } from "react";

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
