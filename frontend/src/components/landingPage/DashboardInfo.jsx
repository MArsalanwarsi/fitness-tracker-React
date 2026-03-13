import React from "react";
import HeroIMG from "../../assets/Dashboard_SS/Notification.png";
import HealthTrack from "../../assets/Dashboard_SS/Health_Track.png";
import Workout from "../../assets/Dashboard_SS/Workout.png";
import Nutrition from "../../assets/Dashboard_SS/Nutrition.png";
import Title from "../../components/ui/components/Title";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const DashboardInfo = () => {
  useGSAP(()=>{
    gsap.from("#cardHolder",{
      filter: "blur(10px)",
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: "#cardHolder",
        start: "top 50%",
      }
    })
  })
  return (
    <section id="dashboard" className="w-full bg-[#252726] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Title
          data={{ title: "A Dashboard Built for Performance" }}
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        />

        <div id="cardHolder"
          className="mt-12 grid gap-6 sm:mt-16 
                lg:grid-cols-3 
                lg:grid-rows-2 
                lg:auto-rows-fr"
        >
          
          <div className="relative lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-white">
              <img
                src={HeroIMG}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="relative h-auto overflow-hidden rounded-3xl bg-white flex items-center justify-center">
              <img
                src={HealthTrack}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="relative lg:col-start-2 lg:row-start-2">
            <div className="relative h-auto overflow-hidden rounded-3xl bg-white">
              <img
                src={Workout}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="relative lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-white">
              <img
                src={Nutrition}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardInfo;
