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

const Steps = () => {
  return (
    <section className="w-full py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {/* CARD 1 */}
          <Card className="w-full py-10 px-6 flex flex-col gap-0 justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full font-black text-white text-3xl">
                  1
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-foreground font-urbanist font-semibold text-3xl sm:text-4xl lg:text-6xl leading-tight tracking-tight">
                Create <br />Your <br /> Account
              </h3>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card className="w-full py-10 px-6 flex flex-col justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full font-black text-white text-3xl">
                  2
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-foreground font-urbanist font-semibold text-3xl sm:text-4xl lg:text-6xl leading-tight tracking-tight">
                Log <br />Workouts <br /> & Meals
              </h3>
            </CardContent>
          </Card>

          {/* CARD 3 */}
          <Card className="w-full py-10 px-6 flex flex-col justify-between rounded-[50px]">
            <CardHeader>
              <CardTitle>
                <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full font-black text-white text-3xl">
                  3
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-foreground font-urbanist font-semibold text-3xl sm:text-4xl lg:text-6xl leading-tight tracking-tight">
                Track Progress <br /> & Improve
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    // <div className="w-full h-screen ">
    //   <div className="flex items-center justify-between h-full w-2/3 mx-auto">
    //     <Card size="sm" className="mx-auto w-full max-w-sm py-10 px-5">
    //       <CardHeader>
    //         <CardTitle>
    //           <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full mr-2 font-black text-white text-3xl">
    //             1
    //           </span>
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <h3 className="font-semibold text-6xl">
    //           Create Your Account
    //         </h3>
    //       </CardContent>
    //     </Card>
    //     <Card size="sm" className="mx-auto w-full max-w-sm py-10 px-5">
    //       <CardHeader>
    //         <CardTitle>
    //           <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full mr-2 font-black text-white text-3xl">
    //             2
    //           </span>
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <h3 className="font-semibold text-6xl">
    //           Log Workouts & Meals
    //         </h3>
    //       </CardContent>
    //     </Card>
    //     <Card size="sm" className="mx-auto w-full max-w-sm py-10 px-5">
    //       <CardHeader>
    //         <CardTitle>
    //           <span className="flex justify-center items-center bg-[#FF672F] w-15 h-15 rounded-full mr-2 font-black text-white text-3xl">
    //             3
    //           </span>
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <h3 className="font-semibold text-6xl">
    //           Track Progress & Improve
    //         </h3>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
};

export default Steps;
