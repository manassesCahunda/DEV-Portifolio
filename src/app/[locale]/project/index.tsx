'use client';

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Timeline = dynamic(() => import("@/components/timeline").then(mod => mod.Timeline));
const Section = dynamic(() => import("@/components/section").then(mod => mod.Section));

export  const  Project =() => {
   const t = useTranslations();
   const items = t.raw("project");
   
  return (
   <Section className="h-screen w-full flex items-center justify-center snap-start bg-white">
      <Timeline items={items} />
    </Section>
  )
}

