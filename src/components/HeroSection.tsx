import bg from "../images/Heading-card .png"; 
import { motion } from "framer-motion";
import Button from "./Button";


const HeroSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center h-screen "
      style={{ backgroundImage: `url(${bg})` }} 
    >
      <motion.div
        className="relative z-10 flex flex-col items-start  justify-center  text-white ml-24 font-opensans  md:px-12 h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl md:text-3xl lg:text-h1 font-bold mb-4 w-full md:w-[500px]">
          Digitizing Community Service, Empowering Rwanda
        </h1>
        <p className="text-base md:text-xl lg:text-h5 max-w-[630px] mb-8">
          The UmugandaTech connects dedicated volunteers with  impactful community projects across Rwanda,
           streamlining organization, enhancing participation, 
          and celebrating  collective effort for national development.
        </p>
        <Button onClick={() => alert('Button clicked!')}>Get Started</Button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
