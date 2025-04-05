import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import Footer from "../Components/Footer";
import WhyEdu from "../Components/WhyEdu";
import OurMission from "../Components/OurMission";
import Review from "../Components/Review";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: true,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <>
      <HeroSection />
      <WhyEdu/>
      <OurMission />
      <Review />
      <Footer />
    </>
  );
};

export default Home;