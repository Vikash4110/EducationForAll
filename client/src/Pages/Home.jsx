import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import CoreSection from "../Components/CoreSection";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";

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
      <CoreSection />
      {/* <BlogSection />
      <WhyEdu />
      <OurMission />
      <Review /> */}
      <Footer />
    </>
  );
};

export default Home;
