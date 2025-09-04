import AboutAndHowItWorks from "../components/AboutAndHowItWorks"
import CarouselSteps from "../components/CarouselSteps"
import HeroSection from "../components/HeroSection"
import Voluteers from "../components/landingPage/Voluteers"
import Participate from "../components/landingPage/Participate"
import Personalinfo from "../components/landingPage/Personalinfo"


const Home = () =>{
  return (
    < >
    <HeroSection />
      <section id="about_us"><AboutAndHowItWorks /></section>
      <section id="how_it_works"><CarouselSteps /></section>
      <section id="projects"><Voluteers /><Personalinfo /><Participate /></section>
    </>
  )
}

export default Home