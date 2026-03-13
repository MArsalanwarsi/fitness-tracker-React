import React from "react";
import HeroIMG from "../../assets/Hero_IMG/Hero_IMG.png";
import BgVideo from "../../assets/Video/Cinematic_Fitness.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const WhyWe = () => {
  useGSAP(() => {
    gsap.from("#about h1", {
      filter: "blur(10px)",
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#about h1",
        start: "top 50%",
      },
    });
    gsap.from("#about p", {
      filter: "blur(10px)",
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#about p",
        start: "top 50%",
      },
    });
  });
  return (
    <div id="about" className="w-full h-screen md:h-[80%] flex items-center">
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-32">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 lg:gap-16">
            <div className="md:w-2/3">
              <h1
                className="
            text-[60px]
            font-semibold
            text-foreground
            font-urbanist
            leading-[55px]
            lg:leading-[70px]
            xl:leading-[90px]
            tracking-[-1px]
            md:text-[55px]
            lg:text-[75px]
            xl:text-[90px]
            2xl:text-8xl
          "
              >
                Why Modern Fitness Needs Smart Tracking
              </h1>
            </div>
            <div className="md:w-1/3">
              <p
                className="
            text-foreground
            text-2xl
            leading-[30px]
            lg:leading-[35px]
            xl:leading-[40px]
            font-urbanist
            sm:text-lg
            md:text-xl
            lg:text-[25px]
            xl:text-[35px]
          "
              >
                Our Fitness Tracker gives you complete control with structured
                workout logs, nutrition tracking, and real-time progress
                analytics, all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyWe;
