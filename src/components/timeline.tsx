'use client';

import * as React from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Code, Briefcase, GraduationCap, Star, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image"
import { a } from "@react-spring/web";

interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
  type: "education" | "work" | "project"
  technologies?: string[]
  link?: string
  imageUrl?: string,
  code:string
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const [filter, setFilter] = React.useState<string | null>(null);
  const controls = useAnimation();
  const y = useMotionValue("0%");
  const totalDuration = 10;
  const [isPaused, setIsPaused] = React.useState(false);
  const pausedRef = React.useRef(false);
  const animatingRef = React.useRef(false);

  const filteredItems = React.useMemo(() => {
    if (!filter || filter === "Todos") return items;
    return items.filter(
      (item) => item.type === filter || item.technologies?.includes(filter)
    );
  }, [items, filter]);

  const duplicatedItems = React.useMemo(
    () => [...filteredItems, ...filteredItems],
    [filteredItems]
  );

  const animateCycle = React.useCallback(
    (startValue: number) => {
      if (pausedRef.current) return;
      animatingRef.current = true;
      const remainingDistance = -50 - startValue;
      const absDistance = Math.abs(remainingDistance);
      const duration = (absDistance / 50) * totalDuration;
      controls
        .start({
          y: "-50%",
          transition: { duration, ease: "linear" },
        })
        .then(() => {
          if (!pausedRef.current) {
            controls.set({ y: "0%" });
            animatingRef.current = false;
            animateCycle(0);
          } else {
            animatingRef.current = false;
          }
        });
    },
    [controls, totalDuration]
  );

  React.useEffect(() => {
    if (!pausedRef.current && !animatingRef.current) {
      animateCycle(0);
    }
  }, [animateCycle]);

  const pauseAnimation = React.useCallback(() => {
    setIsPaused(true);
    pausedRef.current = true;
    controls.stop();
  }, [controls]);

  const resumeAnimation = React.useCallback(() => {
    if (pausedRef.current) {
      setIsPaused(false);
      pausedRef.current = false;
      const currentValue = parseFloat(y.get().toString());
      animateCycle(currentValue);
    }
  }, [animateCycle, y]);

  return (
    <motion.div className="relative min-h-screen w-full overflow-hidden">
      <Select onValueChange={(value) => setFilter(value)}>
        <SelectTrigger className="w-[210px] absolute top-6 right-5 flex justify-center items-center p-4 bg-black">
          <Filter className="mr-2 h-4 w-4 text-white" />
          <SelectValue className="text-white placeholder-white" placeholder="Todos os Projetos" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="education">Educação</SelectItem>
            <SelectItem value="work">Trabalho</SelectItem>
            <SelectItem value="project">Projeto</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <motion.div className="mx-auto max-w-4xl" style={{ y }} animate={controls}>
        {duplicatedItems.map((item, index) => (
          <TimelineItemComponent
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            onMouseEnter={pauseAnimation}
            onMouseLeave={resumeAnimation}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

interface TimelineItemComponentProps {
  item: TimelineItem;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const TimelineItemComponent = React.memo(function TimelineItemComponent({
  item,
  index,
  onMouseEnter,
  onMouseLeave,
}: TimelineItemComponentProps) {
  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "education":
        return GraduationCap;
      case "work":
        return Briefcase;
      case "project":
        return Code;
      default:
        return Star;
    }
  };

  const Icon = getIcon(item.type);
  const isLeft = index % 2 === 0;

  return (
    <motion.div className={`relative mb-12 flex w-full items-center ${isLeft ? "justify-end" : "justify-start"}`}>
      <motion.div
        style={{
          backgroundColor:"rgba(0, 0, 0, 0.77)",
        }}
        className="relative w-5/12 rounded-lg p-6 shadow-xl border border-gray-700 hover:border-blue-500"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: index * 0.2 }}
      >        
      {item.imageUrl && (
        <div className="mb-4 overflow-hidden p-5  bg-white ">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            width={400}
            height={200}
            className="object-cover"
          />
        </div>
      )}
        <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
        <p className="mb-4 text-sm text-gray-300">{item.description}</p>
        <span className="text-xs font-medium text-gray-400">{item.date}</span>
        {item.technologies && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (<span key={tech} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">{tech}</span>))}
          </div>
        )}
        {item.code && (
        <a href={item.code} className="hover:text-white">
            <div className="flex mt-4">
              <Code className="h-8 w-8 pr-2 text-blue-200 hover:text-white" />
              <span className="pt-1.5 text-sm text-blue-200 hover:text-white"> Ver Codigo</span>
            </div>
        </a>
        )}
      </motion.div>
      <motion.div
        className="absolute left-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white border text-black shadow-lg"
        style={{ translateX: "-50%" }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: "tween", duration: 5, ease: "linear" }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
    </motion.div>
  );
});

export default Timeline;
