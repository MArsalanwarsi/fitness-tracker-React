import React from "react";
import Marquee from "react-fast-marquee";
import IconWhite from "../../../assets/logo/Logo_Color_Mark.png";

const FooterMarquee = (props) => {
  return (
    <Marquee
      className={` py-2 h-15 md:h-30 lg:h-40 xl:h-50 overflow-hidden ${props.data.classText}`}
      speed={150}
      gradient={false}
      autoFill={true}
    >
      <div className="flex items-center md:gap-8 lg:gap-10 xl:gap-20">
        <span className="">
          <img
            src={IconWhite}
            alt="Fitness Tracker Icon"
            className="h-[30px] md:h-[50px] lg:h-[60px] xl:h-[90px] w-auto pr-0 md:ml-9 lg:ml-10 xl:ml-20"
          />
        </span>
        <span className="font-urbanist text-[30px] md:text-[80px] lg:text-[100px] xl:text-[150px] md:tracking-[-3px] lg:tracking-[-3px] xl:tracking-[-5px] font-medium ">
          Fitness Tracker
        </span>
      </div>
    </Marquee>
  );
};

export default FooterMarquee;
