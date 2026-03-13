import React from "react";
import TestimonialsComponent from "@/components/testimonials-component-18";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Testimonial = () => {
  useGSAP(() => {
    gsap.from("#testimonial #box", {
      filter: "blur(20px)",
      opacity: 0,
      duration: .7,
      scrollTrigger: {
        trigger: "#testimonial #box",
        start: "top 30%",
      },
    });
    gsap.from("#testimonial .testimonials", {
      filter: "blur(20px)",
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
      scrollTrigger: {
        trigger: "#testimonial #box",
        start: "top 30%",
      },
    });
  });
  const testimonials = [
    {
      name: "Ahmed R.",
      role: "Software Engineer",
      company: "Karachi Tech",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      content:
        "I finally understand my workout progress clearly. The analytics keep me motivated every single week.",
    },
    {
      name: "Sara Khan",
      role: "University Student",
      company: "IBA",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      content:
        "Tracking meals and workouts in one dashboard changed everything for me. Super clean and easy to use.",
    },
    {
      name: "Hassan Ali",
      role: "Personal Trainer",
      company: "FitZone Gym",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 4,
      content:
        "The workout logging and performance metrics make training structured and professional.",
    },
  ];

  return (
    <div id="testimonial" className="w-full h-auto py-16 lg:py-24">
      <div id="box" className="py-16 lg:py-9 bg-primary w-fit mx-auto px-6 lg:px-20 rounded-[40px] text-white font-urbanist">
        <div className="testimonials">
        <TestimonialsComponent testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
