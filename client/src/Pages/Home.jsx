import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import BlogSection from "../Components/BlogSection";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import OurMission from "../Components/OurMission";
import Review from "../Components/Review";
import WhyEdu from "../Components/WhyEdu";

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
      <BlogSection />
      <WhyEdu />
      <OurMission />
      <Review />
      <Footer />
    </>
  );
};

export default Home;
