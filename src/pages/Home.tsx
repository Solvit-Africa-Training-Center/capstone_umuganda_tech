import AboutAndHowItWorks from "../components/AboutAndHowItWorks"
import CarouselSteps from "../components/CarouselSteps"
import HeroSection from "../components/HeroSection"
import Voluteers from "../components/landingPage/Voluteers"
import Participate from "../components/landingPage/Participate"
import Personalinfo from "../components/landingPage/Personalinfo"


const Home = () =>{
  return (
    <div >
      <HeroSection />
      <AboutAndHowItWorks />
      <CarouselSteps />
      <div className="grid grid-cols-1">
      <Voluteers/>
      <Personalinfo/>
      <Participate/> 
    </div>
    </div>
  )
}

export default Home