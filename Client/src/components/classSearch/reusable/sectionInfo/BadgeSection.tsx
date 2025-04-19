type BadgeProps = {
  variant:
    | "default"
    | "destructive"
    | "secondary"
    | "content"
    | "outlined"
    | "open"
    | "closed"
    | "classNumber"
    | "waitlist"
    | "schedule"
    | "selected";
  className?: string;
  children: React.ReactNode;
};

const BadgeSection: React.FC<BadgeProps> = ({
  variant,
  className,
  children,
}) => {
  const baseStyles = "px-2 py-1 rounded text-xs font-medium";
  let variantStyles = "";

  if (variant === "destructive") {
    variantStyles = "bg-red-500 text-white";
  } else if (variant === "secondary") {
    variantStyles =
      "bg-blue-200 text-blue-800 dark:bg-blue-300 dark:text-blue-900";
  } else if (variant === "default") {
    variantStyles =
      "bg-gray-200 text-gray-800 dark:bg-slate-500 dark:text-gray-100";
  } else if (variant === "outlined") {
    variantStyles = "border border-white text-white bg-[#1E293B] px-3 py-1";
  } else if (variant === "open") {
    variantStyles = "text-[#5EB752] bg-[#334155] px-3 py-1";
  } else if (variant === "closed") {
    variantStyles = "text-[#EC8B8B] bg-[#334155] px-3 py-1";
  } else if (variant === "classNumber") {
    variantStyles = "bg-[#334155] text-white px-3 py-1";
  } else if (variant === "waitlist") {
    variantStyles = "text-[#FACC15] bg-[#334155] px-3 py-1";
  } else if (variant === "schedule") {
    variantStyles =
      "bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-gray-300 p-1";
  } else if (variant === "selected") {
    variantStyles =
      "bg-black/80 text-gray-100 dark:bg-black/80 dark:text-gray-100 p-1";
  } else {
    variantStyles =
      "bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-gray-300 p-1";
  }

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default BadgeSection;
