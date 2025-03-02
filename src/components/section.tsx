"use client";

import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Section = ({ title, subtitle, content, children, className, ...props }: Props) => {
  return (
    <section className={cn("h-screen flex flex-col items-center justify-center snap-start", className)} {...props}>
      {title && <h1 className="text-5xl font-bold text-primary mb-4">{title}</h1>}
      {subtitle && <h2 className="text-2xl text-gray-300  mb-8">{subtitle}</h2>}
      {content && <p className="text-xl text-center max-w-2xl">{content}</p>}
      {children}
    </section>
  );
};
