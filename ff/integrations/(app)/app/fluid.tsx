"use client"

import Script from "next/script";
import { useEffect } from "react";
import { parse, formatRgb } from 'culori'; // Import from culori npm package

export function Fluid() {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const rootEl = document.documentElement;
                const computedStyle = getComputedStyle(rootEl);
                const backgroundCssVar = computedStyle.getPropertyValue('--background').trim();

                if (backgroundCssVar) {
                    try {
                        const colorObj = parse(backgroundCssVar); // Use imported parse

                        if (colorObj && colorObj.mode) {
                            const rgbColorString = formatRgb(colorObj); // Use imported formatRgb
                            localStorage.setItem('FLUID_BACKGROUND', rgbColorString);
                            console.log('FLUID_BACKGROUND set in localStorage from --background:', rgbColorString);
                        } else {
                            console.error('Culori could not parse --background CSS variable:', backgroundCssVar, '(parsed as: ', colorObj, ')');
                        }
                    } catch (parseError) {
                        console.error('Error parsing --background with culori:', backgroundCssVar, parseError);
                    }
                } else {
                    console.warn('--background CSS variable not found on root element or is empty. FLUID_BACKGROUND not set from CSS var.');
                }
            }
        } catch (e) {
            console.error('Error in Fluids component useEffect for FLUID_BACKGROUND setup:', e);
        }
    }, []);

    return (
        <div className="relative h-full w-full">
            <Script id="show-fluids">
                {`
                  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                  ga('create', 'UA-105392568-1', 'auto');
                  ga('send', 'pageview');`
                }
            </Script>
            <Script src="fluid.js" />
            <canvas className="h-full w-full rounded-md border"></canvas>
        </div>
    );
}