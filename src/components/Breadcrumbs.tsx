import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      aria-label="Kruimelpad"
      className="w-full text-sm text-gray-500 flex items-center gap-2 flex-wrap"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400 select-none">/</span>}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-gray-700 font-medium select-none"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
