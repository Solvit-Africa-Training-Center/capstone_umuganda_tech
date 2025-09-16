import React from "react";

// --- Main Card Component ---
// This is a container component with a common class structure.
type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Card = ({ children, className, ...props }: CardProps) => (
  <div
    className={`bg-white rounded-2xl shadow-md border border-gray-200 ${className || ""}`}
    {...props}
  >
    {children}
  </div>
);

// --- Card Header Component ---
// This component provides a structured header with an icon, title, and optional description.
type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const CardHeader = ({ icon, title, description, className, ...props }: CardHeaderProps) => (
  <div className={`p-6 flex items-start gap-4 ${className || ""}`} {...props}>
    {icon && <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>}
    <div>
      {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  </div>
);

// --- Card Content Component ---
// This component wraps the main content of the card.
type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const CardContent = ({ children, className, ...props }: CardContentProps) => (
  <div className={`p-6 ${className || ""}`} {...props}>
    {children}
  </div>
);