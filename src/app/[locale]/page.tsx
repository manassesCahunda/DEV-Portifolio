'use client';

import dynamic from "next/dynamic";
import ScrollView from "@/components/scroll-view";
import { animated as web } from "@react-spring/web";
import { useTranslations } from "next-intl";

const Fabs = dynamic(() => import("@/components/Fab").then(mod => mod.Fabs));
const About = dynamic(() => import("@/app/[locale]/about/index").then(mod => mod.About));
const Project = dynamic(() => import("@/app/[locale]/project/index").then(mod => mod.Project));
const Skills = dynamic(() => import("@/app/[locale]/skills/index").then(mod => mod.Skills));

export default function HomePage() {
    const t = useTranslations(); 
    const items = t.raw("contact");
   
    return (
        <>
            <div>
              <Fabs items={items} /> 
            </div>
            <ScrollView>
                <About/>    
                <Project/>
                <Skills/>
            </ScrollView>
        </>
    );
}
