import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

// import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Title from "../../components/ui/components/Title";

const Features = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const features = [
    {
      title: "Personalized Dashboard",
      description:
        "Log sets, reps, and weights while visualizing your long-term performance with structured analytics.",
      image:
        "https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU=",
    },
    {
      title: "Smart Nutrition Tracking",
      description:
        "Track calories, macros, and meals daily to stay aligned with your fitness goals.",
      image:
        "https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU=",
    },
    {
      title: "Workout Analytics",
      description:
        "Understand trends, improvements, and weak points through clear visual reports.",
      image:
        "https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU=",
    },
    {
      title: "Progress Monitoring",
      description:
        "Track body metrics, weight changes, and transformation milestones.",
      image:
        "https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU=",
    },
    {
      title: "Goal Setting",
      description:
        "Set custom fitness goals and stay motivated with structured progress tracking.",
      image:
        "https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU=",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 flex justify-center">
      <div className="w-full max-w-7xl bg-[#FF672F] rounded-3xl sm:rounded-[40px] lg:rounded-[50px] px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-20">
        {/* Title */}
        <Title
          data={{ title: "Powerful Features Designed for Results" }}
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        />

        {/* Carousel */}
        <div className="mt-10">
          <Carousel
            plugins={[plugin.current]}
            opts={{ loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem
                  key={index}
                  className="
            pl-4
            basis-full
            sm:basis-1/2
            lg:basis-1/3
          "
                >
                  <Card className="rounded-3xl overflow-hidden shadow-md p-0 pb-4 h-full flex flex-col">
                    <div className="p-2">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="aspect-video w-full object-cover rounded-2xl"
                      />
                    </div>

                    <CardHeader className="flex-grow">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl font-urbanist">
                        {feature.title}
                      </CardTitle>

                      <CardDescription className="font-urbanist text-sm sm:text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter>
                      <Button className="rounded-full font-urbanist w-full">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Hide arrows on mobile */}
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
    // <div className="flex justify-center items-center w-full h-screen px-20">
    //   <div className="flex flex-col justify-center items-center gap-10 w-fit h-fit px-20 py-20 bg-[#FF672F] rounded-[50px]">
    //     <Title data={{ title: "Powerful Features Designed for Results" }} className="text-white" />

    //     <Carousel
    //       plugins={[plugin.current]}
    //       className="w-full max-w-fit"
    //       opts={{
    //         // align: "start",
    //         loop: true,
    //       }}
    //     >
    //       <CarouselContent className="-ml-1">
    //         {Array.from({ length: 5 }).map((_, index) => (
    //           <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3">
    //             <div className="">
    //               <Card className="mx-0 w-fit pt-0 rounded-[35px]">
    //                 <div className="p-1.5">
    //                   <img
    //                     src="https://media.istockphoto.com/id/1472539079/vector/dark-color-gradient-background-grainy-gradient-luminous-color-splash-wave-abstract-noise.jpg?s=612x612&w=0&k=20&c=y2WMcMkmUAF7rAvwfsTgPkFhYi3a_J_n5NnmX4-ZEDU="
    //                     alt="Event cover"
    //                     className="aspect-video w-full object-cover rounded-[35px]"
    //                   />
    //                 </div>
    //                 <CardHeader>
    //                   <CardAction>
    //                     <Badge variant="secondary">Featured</Badge>
    //                   </CardAction>
    //                   <CardTitle>Design systems meetup</CardTitle>
    //                   <CardDescription>
    //                     A practical talk on component APIs, accessibility, and
    //                     shipping faster.
    //                   </CardDescription>
    //                 </CardHeader>
    //                 <CardFooter>
    //                   <Button className="w-full">View Event</Button>
    //                 </CardFooter>
    //               </Card>
    //             </div>
    //           </CarouselItem>
    //         ))}
    //       </CarouselContent>
    //       <CarouselPrevious className="" />
    //       <CarouselNext className="" />
    //     </Carousel>
    //   </div>
    // </div>
  );
};

export default Features;
