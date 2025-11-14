import {
  BuildingIcon,
  CalendarIcon,
  GlobeIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
  number: number;
  label: string;
  icon: string;
}

export function StatsCounter({ number, label, icon }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  function animateCount() {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = (t: number) => t * (2 - t);

    let frame = 0;
    const countTo = number;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = Math.round(countTo * progress);

      if (currentCount >= countTo) {
        setCount(countTo);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
  }

  function getIcon(iconName: string) {
    switch (iconName) {
      case "users":
        return <UsersIcon className="text-primary-foreground h-10 w-10" />;
      case "globe":
        return <GlobeIcon className="text-primary-foreground h-10 w-10" />;
      case "building":
        return <BuildingIcon className="text-primary-foreground h-10 w-10" />;
      case "calendar":
        return <CalendarIcon className="text-primary-foreground h-10 w-10" />;
      default:
        return <UserIcon className="text-primary-foreground h-10 w-10" />;
    }
  }

  function formatNumber(num: number) {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  }

  return (
    <div className="flex flex-col items-center" ref={countRef}>
      <div className="bg-primary rounded-full p-4">{getIcon(icon)}</div>
      <div className="mb-2 text-4xl font-bold">{formatNumber(count)}</div>
      <div className="text-sky-100">{label}</div>
    </div>
  );
}
