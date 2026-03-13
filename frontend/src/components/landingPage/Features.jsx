import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCards from "../kokonutui/spotlight-cards";
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  useGSAP(() => {
    gsap.from(".SpotlightCards", {
      filter: "blur(10px)",
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
      stagger: .2,
      scrollTrigger: {
        trigger: ".feature",
        start: "top 50%",
      },
    });
  });

  

  return (
    <section className="feature mt-19 bg-primary w-full py-16 sm:py-20 lg:py-28 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-12 flex justify-center">
      <div className="w-full max-w-7xl">
        <SpotlightCards eyebrow="" heading="" className="rounded-3xl" />
      </div>
    </section>
  );
};

export default Features;
