import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  type: "link" | "button";
  color: "primary" | "warning" | "danger" | "bg" | "success" | "custom";
  size: "small" | "medium" | "large" | "custom";
  href?: string;
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => any;
  className?: string;
  children?: ReactNode;
};

const Button = ({
  type,
  href,
  onClick,
  color,
  className,
  buttonType,
  size,
  children,
}: Props) => {
  let sizeClasses = "";
  switch (size) {
    case "small":
      sizeClasses = "font-semibold py-1 px-2";
      break;
    case "medium":
      sizeClasses = "font-bold py-2 px-4";
      break;
    case "large":
      sizeClasses = "text-base md:text-xl font-semibold py-4 px-8";
      break;
  }

  let colorClasses = "";
  switch (color) {
    case "primary":
      colorClasses = "text-nord6 bg-nord9 hover:bg-nord10 focus:bg-nord10";
      break;
    case "warning":
      colorClasses = "text-nord0 bg-nord13 hover:bg-nord12 focus:bg-nord12";
      break;
    case "danger":
      colorClasses =
        "text-nord11 bg-transparent border-2 border-nord11 hover:border-0 hover:bg-nord11 hover:text-nord6 focus:border-0 focus:bg-nord11 focus:text-nord6";
      break;
    case "bg":
      colorClasses = "text-nord0 bg-nord6 hover:bg-gray-300 focus:bg-gray-300";
      break;
    case "success":
      colorClasses =
        "text-nord14 bg-transparent border-2 border-nord14 hover:border-0 hover:bg-nord14 hover:text-nord6 focus:border-0 focus:bg-nord14 focus:text-nord6";
      break;
  }
  return type === "link" ? (
    <Link href={href as string}>
      <a
        className={`rounded ${sizeClasses} ${colorClasses} ${
          className ? className : ""
        }`}
      >
        {children}
      </a>
    </Link>
  ) : (
    <button
      className={`rounded ${sizeClasses} ${colorClasses} ${
        className ? className : ""
      }`}
      type={buttonType}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
