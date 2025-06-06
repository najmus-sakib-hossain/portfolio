import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import type { SVGProps } from "react";
import { SocialMedias } from "@/components/portfolio/blog-card-section";
import { Briefcase, CircleSlash2, Dribbble, Figma, Framer } from "lucide-react";
import Image from "next/image";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { LtDemo } from "@/components/lt-demo";

export default function Home() {
  const Icon = ({ className, ...rest }: any) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        {...rest}
        className={cn("absolute z-[100000]  size-6", className)}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
      </svg>
    );
  };

  return (
    <div className="container flex max-w-screen-xl flex-col items-center space-y-8 pb-[75px]">
      <LtDemo />
      <div className="mt-4 w-full space-y-8">
        <span className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
          Designing Distinct Brand Identities with Curiosity and Vision
        </span>
        <div className="flex w-full flex-col justify-between space-y-4 text-muted-foreground md:flex-row md:space-y-0">
          <div className="flex flex-col space-y-2 md:max-h-[200px] md:w-3/5">
            <span className="mt-2">
              Sketches? I bring them to life as brand visuals. Striving to shape as many iconic identities as possible.
            </span>
            <div className="flex h-full flex-col space-y-2 md:justify-end">
              <div className="flex flex-col">
          <span>Now</span>
          <div className="flex items-center text-foreground">
            <CircleSlash2 className="mr-2 size-4" /> Independent, shaping brand identities for new clients.
          </div>
              </div>
              <div className="flex flex-col">
          <span>Previously</span>
          <div className="flex items-center text-foreground">
            <Briefcase className="mr-2 size-4" /> Brand designer at Dribbble & Behance.
          </div>
              </div>
            </div>
          </div>
          <div className="w-full md:max-w-[400px]">
            <div className="relative min-h-[150px] border border-dashed">
              <Icon className="-left-3 -top-3" />
              <Icon className="-right-3 -top-3" />
              <Icon className="-bottom-3 -left-3" />
              <Icon className="-bottom-3 -right-3" />
              <div className={cn("flex flex-col p-4")}>
                <div className="flex w-full items-center justify-center space-x-4 rounded-md p-2 px-0 hover:bg-card hover:text-primary md:justify-evenly">
                  <Image width={50} height={50} src="/portfolio.png" alt="manfromexistnece" className="rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-foreground">Tanvir Hasan Bijoy</span>
                    <span>From Bangladesh</span>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full border p-1">
                    ❤
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-center space-x-2">
                  <Link href={"https://www.facebook.com/tanvirhasan.bijoy.16"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <Facebook />
                  </Link>
                  <Link href={"https://www.linkedin.com/in/tanvirhasan002/"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <LinkedIn />
                  </Link>
                  <Link target="_blank" href={"mailto:tanvirdesigner00202@gmail.com"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <Gmail />
                  </Link>
                  <Link href={"https://www.behance.net/tanvirhasan00"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <Framer className="invert dark:invert-0 size-4" />
                  </Link>
                  <Link href={"https://dribbble.com/Tanvirhasan00"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <Dribbble className="invert dark:invert-0 size-4" />
                  </Link>
                  <Link href={"https://dribbble.com/Tanvirhasan00"} className="flex size-12 items-center justify-center rounded-full hover:bg-card hover:text-primary">
                    <Figma className="invert dark:invert-0 size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SocialMedias />
      <SiteFooter />
    </div>
  );
}

const Gmail = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 49.4 512 399.42" width="1em" height="1em" {...props}><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" /><path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" /><path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" /></g><path fill="#ea4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" /><path fill="#c5221f" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" /></g></svg>;
const LinkedIn = (props: SVGProps<SVGSVGElement>) => <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" {...props}><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2" /></svg>;
const Facebook = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="url(#a)" height="1em" width="1em" {...props}><defs><linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a"><stop offset="0%" stopColor="#0062E0" /><stop offset="100%" stopColor="#19AFFF" /></linearGradient></defs><path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" /><path fill="#FFF" d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z" /></svg>;
