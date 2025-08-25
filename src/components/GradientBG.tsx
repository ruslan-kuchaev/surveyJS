"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import { config } from "@/lib/gradient";

export const GradientBG = () => {
    const containerRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const neat = new NeatGradient({
            ref: containerRef.current,
            ...config,

        });

        const observer = new MutationObserver(() => {
            document.querySelectorAll("a").forEach(link => {
                
                if (link.href.includes("https://neat.firecms.co")) {
                    link.style.display = "none";
                }
            });
        });

       
        observer.observe(document.body, { childList: true, subtree: true });




        return () => {
            neat.destroy?.();
        };
    }, []);

    return <canvas ref={containerRef} className="w-full h-full absolute -z-10 " />;
};
