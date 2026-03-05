import Hero from '../../components/landingPage/Hero'
import WhyWe from '../../components/landingPage/WhyWe'
import Features from '../../components/landingPage/Features'
import DashboardInfo from '../../components/landingPage/DashboardInfo'
import Steps from '../../components/landingPage/Steps'
import Testimonial from '../../components/landingPage/Testimonial'
import Footer from '../../components/landingPage/Footer'

export default function WebsiteHome() {
    return (
        <>
            <Hero />
            <WhyWe />
            <Features />
            <DashboardInfo />
            <Steps />
            <Testimonial />
            <Footer />
        </>
    )
}
