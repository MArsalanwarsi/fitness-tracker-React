import React from "react";
import HeroIMG from "../../assets/Dashboard_SS/Notification.png";
import HealthTrack from "../../assets/Dashboard_SS/Health_Track.png";
import Workout from "../../assets/Dashboard_SS/Workout.png";
import Nutrition from "../../assets/Dashboard_SS/Nutrition.png";
import Title from "../../components/ui/components/Title";

const DashboardInfo = () => {
  return (
    <section className="w-full bg-[#252726] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Title
          data={{ title: "A Dashboard Built for Performance" }}
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        />

        <div
          className="mt-12 grid gap-6 sm:mt-16 
                lg:grid-cols-3 
                lg:grid-rows-2 
                lg:auto-rows-fr"
        >
          {/* LEFT LARGE */}
          <div className="relative lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-white">
              <img
                src={HeroIMG}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TOP RIGHT */}
          <div className="relative">
            <div className="relative h-auto overflow-hidden rounded-3xl bg-white flex items-center justify-center">
              <img
                src={HealthTrack}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* BOTTOM CENTER (FIXED WORKOUT CARD) */}
          <div className="relative lg:col-start-2 lg:row-start-2">
            <div className="relative h-auto overflow-hidden rounded-3xl bg-white">
              <img
                src={Workout}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* RIGHT LARGE */}
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

    // <div className="w-full h-screen bg-[#252726]">
    //   <div class="py-24 sm:py-32">
    //     <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
    //       <Title
    //       data={{ title: "A Dashboard Built for Performance" }}
    //       className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
    //     />
    //       <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
    //         <div class="relative lg:row-span-2">
    //           <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl"></div>
    //           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
    //             <div class="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
    //               <img
    //                 src={HeroIMG}
    //                 alt=""
    //                 class="size-full object-cover object-top"
    //               />
    //             </div>
    //           </div>
    //           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl"></div>
    //         </div>
    //         <div class="relative max-lg:row-start-1">
    //           <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl"></div>
    //           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
    //             <div class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
    //               <img
    //                 src={HealthTrack}
    //                 alt=""
    //                 class="w-full max-lg:max-w-xs"
    //               />
    //             </div>
    //           </div>
    //           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
    //         </div>
    //         <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
    //           <div class="absolute inset-px rounded-lg bg-white"></div>
    //           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
    //             <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
    //               <img
    //                 src={Workout}
    //                 alt=""
    //                 class="h-[min(152px,40cqw)] object-cover"
    //               />
    //             </div>
    //           </div>
    //           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5"></div>
    //         </div>
    //         <div class="relative lg:row-span-2">
    //           <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
    //           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">

    //             <div class="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
    //               <img
    //                 src={Nutrition}
    //                 alt=""
    //                 class="size-full object-cover object-top"
    //               />
    //             </div>
    //           </div>
    //           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DashboardInfo;
