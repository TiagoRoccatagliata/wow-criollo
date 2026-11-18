import type { ComponentPropsWithRef, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type SelectProps = ComponentPropsWithRef<"select"> & { icon?: ReactNode };

export function Select({ icon, children, ...props }: SelectProps) {
  return (
    <span className={`select-control${icon ? " select-has-icon" : ""}`}>
      {icon && <span className="select-leading-icon">{icon}</span>}
      <select {...props}>{children}</select>
      <ChevronDown
        className="select-chevron"
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </span>
  );
}
