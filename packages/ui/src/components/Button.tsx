import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export const Button: React.FC<Props> = ({ variant="primary", ...props }) => (
  <button className={`px-4 py-2 rounded ${variant==="primary"?"bg-black text-white":"border"}`} {...props} />
);
