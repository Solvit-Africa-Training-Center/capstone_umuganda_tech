import Footer from "./components/landingPage/Footer"
import Participate from "./components/landingPage/Participate"
import Personalinfo from "./components/landingPage/Personalinfo"
import Voluteers from "./components/landingPage/Voluteers"



function App() {


  return (
    <>
    <div className="grid grid-cols-1">
      <Voluteers/>
      <Personalinfo/>
      <Participate/>
      <Footer/>
    </div>
     
    </>
  )
}

export default App
