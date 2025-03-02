"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { Table, TableCell, TableRow ,TableBody } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Battery } from "lucide-react";
import { useTranslations } from "next-intl";

const Section = dynamic(() => import("@/components/section").then(mod => mod.Section));

export const Skills = () => {
  const t = useTranslations();
  const skills = t.raw("skills");
  const [backgroundColor, setBackgroundColor] = useState("hsla(245, 95.00%, 7.80%, 0.79)");
  const [chargePercentage, setChargePercentage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isCharged, setIsCharged] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(skills[0].details);
  const [title, setTitle] = useState(skills[0].title);

  useEffect(() => {
    const interval = setInterval(() => {
      setChargePercentage((prev) => {
        if (prev >= 100) {
          setIsCharged(true);
          clearInterval(interval);
          return 100;
        }
        setTimeRemaining((time) => Math.max(time - 1, 0));
        return Math.min(prev + 6.67, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [currentIndex]); 

  const handleRefresh = () => {
    const nextIndex = (currentIndex + 1) % skills.length;
    setCurrentIndex(nextIndex);
    setDate(skills[nextIndex].details);
    setTitle(skills[nextIndex].title);
    setChargePercentage(0);
    setTimeRemaining(30);
    setIsCharged(false);
    setBackgroundColor(generateRandomHSLColor());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor }}>
      <Section title={t('develop')} className="h-screen w-full flex items-center justify-center snap-start">
        <br />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-lg p-6 shadow-lg bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Battery className={isCharged ? "text-black" : "text-yellow-500"} />
              <AnimatePresence mode="wait">
                {isCharged ? (
                  <motion.div key="charged" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center ml-2">
                    <span className="text-gray-700 font-medium text-lg">{title}</span>
                  </motion.div>
                ) : (
                  <motion.div key="charging" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center ml-2">
                    <span className="text-gray-700 font-medium text-lg">{title} -- {chargePercentage.toFixed(0)}%</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {isCharged && date && (
            <Table className="text-gray-600">
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">Tempo de uso</TableCell>
                  <TableCell className="text-right">
                    {date?.time ? `${date.time} anos` : "-"}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">Certificação</TableCell>
                  <TableCell className="text-right">
                    {date?.link ? <a href={date.link}>Link de acesso</a> : "-"}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">Formação</TableCell>
                  <TableCell className="text-right">{date?.educate || "-"}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">Nível de experiência</TableCell>
                  <TableCell className="text-right">{date?.level || "-"}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">Descrição de uso</TableCell>
                  <TableCell className="text-right">{date?.profissional || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            )}
          <br />
          <div className="text-gray-500 text-sm mb-2">
            {isCharged ? `Carregado em ${Math.ceil(30 - timeRemaining)} segundos` : `Pronto em ~${Math.ceil(timeRemaining)} segundos`}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-black"
              style={{ backgroundColor }}
              animate={{ width: `${chargePercentage}%`, transition: { duration: 0.5, ease: "easeInOut" } }}
            />
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ backgroundColor }}
            className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-900 transition-colors"
            onClick={handleRefresh}
          >
            Ir para Próximo {t('develop')}
          </motion.button>
        </motion.div>
      </Section>
    </div>
  );
};

function generateRandomHSLColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 30;
  const lightness = Math.floor(Math.random() * 20) + 10;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
