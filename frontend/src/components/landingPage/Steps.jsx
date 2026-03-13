import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Steps = () => {
  useGSAP(()=> {
    gsap.from("#steps .card",{
      filter: "blur(10px)",
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      scrollTrigger: {
        scrub: true,
        trigger: "#steps",
        start: "top 0%",
        pin: true,
      }
    })
  })
  return (
    <section id="steps" className="w-full py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {/* CARD 1 */}
          <Card className="card w-full py-10 px-6 flex flex-col gap-3 justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span
                  className="
                flex 
                justify-center 
                items-center 
                bg-primary
                w-13 
                h-13 
                md:w-10
                md:h-10 
                lg:w-15
                lg:h-15 
                rounded-full 
                font-black 
                text-white 
                text-[30px]
                md:text-[20px]
                lg:text-[35px]
                "
                >
                  1
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3
                className="
              text-foreground 
              font-urbanist 
              font-semibold 
              text-[39px]
              lg:text-[45px]
              md:text-[27px]
              leading-[40px]
              md:leading-[30px]
              lg:leading-[45px]
              tracking-tight"
              >
                Create <br />
                Your <br />
                Account
              </h3>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card className="card w-full py-10 px-6 flex flex-col gap-3 justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span
                  className="
                flex 
                justify-center 
                items-center 
                bg-primary
                w-13 
                h-13 
                md:w-10
                md:h-10 
                lg:w-15
                lg:h-15 
                rounded-full 
                font-black 
                text-white 
                text-[30px]
                md:text-[20px]
                lg:text-[35px]
                "
                >
                  2
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3
                className="
              text-foreground 
              font-urbanist 
              font-semibold 
              text-[39px]
              lg:text-[45px]
              md:text-[27px]
              leading-[40px]
              md:leading-[30px]
              lg:leading-[45px]
              tracking-tight"
              >
                Log <br />
                Workouts <br />& Meals
              </h3>
            </CardContent>
          </Card>

          {/* CARD 3 */}
          <Card className="card w-full py-10 px-6 flex flex-col gap-3 justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span
                  className="
                flex 
                justify-center 
                items-center 
                bg-primary
                w-13 
                h-13 
                md:w-10
                md:h-10 
                lg:w-15
                lg:h-15 
                rounded-full 
                font-black 
                text-white 
                text-[30px]
                md:text-[20px]
                lg:text-[35px]
                "
                >
                  3
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3
                className="
              text-foreground 
              font-urbanist 
              font-semibold 
              text-[39px]
              lg:text-[45px]
              md:text-[27px]
              leading-[40px]
              md:leading-[30px]
              lg:leading-[45px]
              tracking-tight"
              >
                Track <br />Progress <br />& Improve
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Steps;
