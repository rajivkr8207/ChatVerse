import clsx from "clsx";

const variants = {
  primary: " bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800  border border-orange-500/20 shadow-orange-600/20 group",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={clsx(
        "rounded-xl font-medium transition-all duration-200 focus:outline-none shadow-lg",
        sizes[size],
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;