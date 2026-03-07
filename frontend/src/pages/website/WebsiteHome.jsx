import Hero from '../../components/landingPage/Hero'
import WhyWe from '../../components/landingPage/WhyWe'
import Features from '../../components/landingPage/Features'
import DashboardInfo from '../../components/landingPage/DashboardInfo'
import Steps from '../../components/landingPage/Steps'
import Testimonial from '../../components/landingPage/Testimonial'
import MarqueeIMG from '../../components/landingPage/MarqueeIMG'
import Footer from '../../components/landingPage/Footer'
import { useEffect } from 'react'

const WebsiteHome=()=> {
useEffect(() => {
  document.documentElement.classList.remove('dark');
}, []);

    return (
        <>
            <Hero />
            <MarqueeIMG />
            <WhyWe />
            <Features />
            <DashboardInfo />
            <Steps />
            <Testimonial />
            <Footer />
        </>
    )
}

export default WebsiteHome