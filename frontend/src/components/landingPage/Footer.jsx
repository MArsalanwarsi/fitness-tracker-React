import React from "react";
import Title from "../../components/ui/components/Title";
import FooterMarquee from "../../components/ui/components/FooterMarquee";

const Footer = () => {
  return (
    <div className="w-full h-auto ">
      <section className="bg-foreground lg:grid lg:h-auto lg:place-content-center dark:bg-gray-900">
        <div className="mx-auto w-screen max-w-7xl px-3 pt-7 pb-4 md:px-7 lg:px-10 md:pt-15 md:pb-10 lg:pt-25 lg:pb-12">
          <div className="mx-auto max-w-full text-center">
            <Title
              data={{ title: "Ready to Take Control of Your Fitness?" }}
              className="text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
            />

            <div className="mt-4 flex justify-center gap-4 sm:mt-6">
              <a
                className="inline-block rounded-full border border-primary bg-primary px-4 sm:px-5 py-2 sm:py-3 font-medium text-white shadow-sm transition-colors hover:brightness-95 text-sm sm:text-base"
                href="#"
              >
                Create Free Account
              </a>
            </div>
            <FooterMarquee data={{ classText: "bg-white mt-6 md:mt-10 rounded-[15px] lg:rounded-[30px] md:rounded-[20px] xl:rounded-[50px] text-foreground" }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
