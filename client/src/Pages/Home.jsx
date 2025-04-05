import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import Footer from "../Components/Footer";
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
      <Footer />
    </>
  );
};

export default Home;