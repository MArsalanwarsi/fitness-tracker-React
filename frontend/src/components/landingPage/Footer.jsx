import React from "react";
import Title from "../../components/ui/components/Title";

const Footer = () => {
  return (
    <div className="w-full h-auto">
      <section className="bg-foreground lg:grid lg:h-auto lg:place-content-center dark:bg-gray-900">
        <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-full text-center">
            <Title
              data={{ title: "Ready to Take Control of Your Fitness?" }}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-8xl"
            />

            <div className="mt-4 flex justify-center gap-4 sm:mt-6">
              <a
                className="inline-block rounded-full border border-primary bg-primary px-4 sm:px-5 py-2 sm:py-3 font-medium text-white shadow-sm transition-colors hover:brightness-95 text-sm sm:text-base"
                href="#"
              >
                Create Free Account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
