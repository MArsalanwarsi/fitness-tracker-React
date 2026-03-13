import React from "react";
import Marquee from "react-fast-marquee";
import IconWhite from "../../../assets/logo/FitnessTracker_IconWhite.png";

const LogoMarquee = (props) => {
  return (
    <Marquee
      className={` py-2 h-15 lg:h-30 -rotate-2 ${props.data.classText}`}
      speed={150}
      gradient={false}
      autoFill={true}
    >
      <div className="flex items-center gap-8">
        <span className="">
          <img
            src={IconWhite}
            alt="Fitness Tracker Icon"
            className="h-[30px] lg:h-[55px] w-auto pr-0 ml-8"
          />
        </span>
        <span className="font-urbanist text-[30px] lg:text-[50px] font-regular text-white">
          Fitness Tracker
        </span>
      </div>
    </Marquee>
  );
};

export default LogoMarquee;
