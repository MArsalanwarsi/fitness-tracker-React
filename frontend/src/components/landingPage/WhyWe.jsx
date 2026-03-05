import React from "react";
import HeroIMG from "../../assets/Hero_IMG/Hero_IMG.png";

const WhyWe = () => {
  return (
    <div className="w-full min-h-screen flex items-center">
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-32">
          {/* Responsive Layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 lg:gap-16">
            {/* LEFT SIDE */}
            <div className="md:w-2/3">
              <h1
                className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            xl:text-7xl
            2xl:text-8xl
            font-semibold
            text-foreground
            font-urbanist
            leading-tight
          "
              >
                Why Modern Fitness Needs Smart Tracking
              </h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="md:w-1/3">
              <p
                className="
            text-base
            sm:text-lg
            md:text-xl
            lg:text-2xl
            text-foreground
            font-urbanist
            leading-relaxed
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

    // <div className="w-full h-screen">
    //   <section class="lg:grid lg:h-screen lg:place-content-center">
    //     <div class="mx-auto w-fit max-w-fit px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
    //       <div class="max-w-3/4 text-left ">
    //         <h1 class="text-8xl font-semibold text-foreground font-urbanist">
    //           Why Modern Fitness Needs Smart Tracking
    //         </h1>
    //       </div>

    //       <div className="w-2/4 mx-auto text-left">
    //         <p class="mt-4 text-3xl text-pretty text-foreground font-urbanist">
    //           Our Fitness Tracker gives you complete control with structured workout logs, nutrition tracking, and real-time progress analytics, all in one place.
    //         </p>
    //       </div>
    //     </div>
    //   </section>
    // </div>
  );
};

export default WhyWe;
