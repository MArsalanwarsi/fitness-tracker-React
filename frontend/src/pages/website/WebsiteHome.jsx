import Hero from '../../components/landingPage/Hero'
import WhyWe from '../../components/landingPage/WhyWe'
import Features from '../../components/landingPage/Features'
import DashboardInfo from '../../components/landingPage/DashboardInfo'
import Steps from '../../components/landingPage/Steps'
import Testimonial from '../../components/landingPage/Testimonial'
import Footer from '../../components/landingPage/Footer'
import LogoMarquee from '../../components/ui/components/LogoMarquee'
import { useEffect } from 'react'
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const WebsiteHome=()=> {
useEffect(() => {
  document.documentElement.classList.remove('dark');
}, []);

    return (
        <>
            <div id="smooth-wrapper ">
        <div id="smooth-content">
          <Hero />
          <LogoMarquee data={{ classText: "bg-primary -mt-10" }} />
          <WhyWe />
          <div className="absolute w-full -translate-y-1/2">
            <LogoMarquee data={{ classText: "bg-foreground mt-30 lg:-ml-[2px]" }} />
          </div>
          <Features />
          <DashboardInfo />
          <Steps />
          <Testimonial />
          <Footer />
        </div>
      </div>
        </>
    )
}

export default WebsiteHome