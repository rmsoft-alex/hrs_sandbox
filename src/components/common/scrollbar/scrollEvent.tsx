"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

const ScrollEvent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  let elementId = useId();

  const [scrollClass, setScrollClass] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let wheeling: string | number | NodeJS.Timeout | undefined;
    if (ref.current) {
      ref.current.addEventListener("wheel", (e) => {
        e.stopPropagation();
        if (!wheeling) {
          setScrollClass("scrollEventStart");
        }

        // 일정시간(400ms) 뒤에 스크롤 동작 멈춤을 감지
        clearTimeout(wheeling);
        wheeling = setTimeout(() => {
          setScrollClass("");
          wheeling = undefined;
        }, 400);
      });
    }
  }, []);

  return (
    <div
      id={`${elementId}`}
      className={cn(
        "flex flex-col h-full overflow-hidden",
        className,
        scrollClass
      )}
      ref={ref}
    >
      <div className="overflow-auto">{children}</div>
    </div>
  );
};

export default ScrollEvent;
