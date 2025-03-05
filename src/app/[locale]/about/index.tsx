'use client';

import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';
import { CircleArrowDown } from "lucide-react";

const Prompt = dynamic(() => import("@/components/three/promp").then(mod => mod.Prompt));
const Section = dynamic(() => import("@/components/section").then(mod => mod.Section));

export const About = () => {
  const t = useTranslations();

  return (
    <Section className="h-screen w-full flex items-center justify-center snap-start mb-40">
      <div className="grid grid-cols-2 w-full gap-8">
        <div className="flex flex-col justify-center items-center space-y-4">
          <Prompt  present={t('present')} profession={t('profession')}/> 
          <div style={{ width: "78%", height: 30 }}>
            <p className="text-lg" style={{ textAlign: "justify" }}>{t('description')}  </p>
            <br />
            <p className="text-lg" style={{ textAlign: "justify" }}>{t('phrase')}  </p>
            <br />
            <a className="flex bg-black w-[200px] h-[50px] p-3 border" href={t('downloadlink')} >
              <CircleArrowDown className="w-7 h-7 pr-2" /> 
              {t('downloader')} 
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img className="max-w-[300px] h-auto"  src={t('avatar')}  alt="Imagem sem fundo" />
        </div>
      </div>
    </Section>
  );
};
