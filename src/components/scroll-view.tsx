"use client";

import React, { useRef, useEffect, useState, ReactNode } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const LanguageSwitcher = dynamic(() =>
  import("@/components/switcher/language").then((mod) => mod.LanguageSwitcher)
);

interface ScrollViewProps {
  children: ReactNode;
}

const ScrollView: React.FC<ScrollViewProps> = ({ children }: ScrollViewProps) => {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const scrollTimeoutRef = useRef<number>();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Aplica propriedades de scroll snap diretamente no container
    container.style.scrollSnapType = "y mandatory";
    container.style.overflowY = "scroll";
    container.style.height = "100vh";

    // Seleciona todas as seções e aplica o alinhamento do snap
    const sections = Array.from(container.querySelectorAll("section"));
    setTotalSections(sections.length);
    sections.forEach((section) => {
      section.style.scrollSnapAlign = "start";
    });

    const handleScroll = () => {
      // Limpa timeout anterior a cada evento de scroll
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      // Aguarda 150ms após o scroll para detectar o fim do movimento
      scrollTimeoutRef.current = window.setTimeout(() => {
        const scrollTop = container.scrollTop;
        const sectionHeight = container.clientHeight;
        // Calcula a seção mais próxima com base na posição do scroll
        const index = Math.round(scrollTop / sectionHeight);
        // Centraliza a seção automaticamente se não estiver perfeitamente alinhada
        container.scrollTo({ top: index * sectionHeight, behavior: "smooth" });
        setActiveSection(index);
      }, 150);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const goToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
    setActiveSection(index);
  };

  return (
    <div ref={scrollContainerRef} className="relative h-screen overflow-y-scroll hide-scrollbar">
      {children}

      {/* Indicador da seção atual */}
      <div className="fixed bottom-4 right-4 bg-black border text-sm text-white p-2">
        {t("section", { count: `: ${activeSection + 1}` })}
      </div>

      {/* Navegação por pontos */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {[...Array(totalSections)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeSection ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir para seção ${index + 1}`}
          />
        ))}
      </div>

      {/* Language Switcher */}
      <div className="fixed top-3 left-3 p-2">
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default ScrollView;
