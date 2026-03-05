import React from "react";
import TestimonialsComponent from "@/components/testimonials-component-18";

const Testimonial = () => {
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
    <div className="w-full h-auto py-16 lg:py-24">
      <div className="py-16 lg:py-9 bg-primary w-fit mx-auto px-6 lg:px-20 rounded-[40px] text-white font-urbanist">
        <TestimonialsComponent testimonials={testimonials} />
      </div>
    </div>
  );
};

export default Testimonial;
