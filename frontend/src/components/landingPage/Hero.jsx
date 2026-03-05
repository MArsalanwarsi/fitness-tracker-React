import React from "react";
import Navbar from "../../components/ui/components/Navbar";
import HeroIMG from "../../assets/Hero_IMG/Hero_IMG.png";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <section className="w-full lg:h-screen lg:flex lg:items-center">
        <div className="w-full px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:py-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground font-urbanist font-bold leading-[1.1]"> 
              Track. <br />Transform. <br />Thrive.
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-foreground font-urbanist">
              Monitor workouts, track nutrition, visualize progress, and stay motivated with powerful insights designed for real results.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                className="inline-block rounded-full border border-primary bg-primary px-4 sm:px-5 py-2 sm:py-3 font-medium text-white shadow-sm transition-colors hover:brightness-95 text-sm sm:text-base"
                href="#"
              >
                Get Started
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img src={HeroIMG} alt="Hero Image" className="w-full h-auto max-h-96 sm:max-h-full object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
