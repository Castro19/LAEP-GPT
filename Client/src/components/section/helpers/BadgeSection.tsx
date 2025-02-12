type BadgeProps = {
  variant: "default" | "destructive" | "secondary" | "content";
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
