// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import {
//   default as Img1,
//   default as Img2,
//   default as Img3,
// } from "../assets/EFAS_Cover_1.webp";

// const EducationCarousel = () => {
//   const slides = [
//     {
//       quote:
//         "When did education stop being about becoming, and start being about passing?",
//       image: Img1,
//     },
//     {
//       quote:
//         "If school is meant to prepare us for life, why does life feel like a separate subject?",
//       image: Img2,
//     },
//     {
//       quote:
//         "Who decided that education should end at childhood, and learning should stop at the classroom door?",
//       image: Img3,
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(1);

//   const nextSlide = () => {
//     setDirection(1);
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setDirection(-1);
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
//     );
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const variants = {
//     enter: (direction) => ({
//       x: direction > 0 ? "100%" : "-100%",
//       opacity: 0.7,
//     }),
//     center: {
//       x: 0,
//       opacity: 1,
//     },
//     exit: (direction) => ({
//       x: direction < 0 ? "100%" : "-100%",
//       opacity: 0.7,
//     }),
//   };

//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-black">
//       {/* Background images */}
//       <AnimatePresence custom={direction} initial={false}>
//         <motion.div
//           key={currentIndex}
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{
//             x: { type: "tween", ease: "easeInOut", duration: 0.8 },
//             opacity: { duration: 0.8 },
//           }}
//           className="absolute inset-0"
//         >
//           <img
//             src={slides[currentIndex].image}
//             alt="Education scene"
//             className="w-full h-full object-cover"
//           />
//         </motion.div>
//       </AnimatePresence>

//       {/* Content */}
//       <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentIndex}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="text-center w-full max-w-4xl"
//           >
//             {/* Quote */}
//             <motion.h1
//               className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 px-4 leading-tight drop-shadow-lg"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               {slides[currentIndex].quote}
//             </motion.h1>

//             {/* Navigation indicators */}
//             <div className="flex justify-center space-x-3 mt-12">
//               {slides.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setDirection(index > currentIndex ? 1 : -1);
//                     setCurrentIndex(index);
//                   }}
//                   className={`w-4 h-4 rounded-full transition-all duration-300 ${
//                     currentIndex === index
//                       ? "bg-white w-8"
//                       : "bg-white/40 hover:bg-white/60"
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       {/* Navigation arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm hover:bg-black/60 transition-all"
//         aria-label="Previous slide"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-sm hover:bg-black/60 transition-all"
//         aria-label="Next slide"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default EducationCarousel;

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  default as Img1,
  default as Img2,
  default as Img3,
} from "../assets/EFAS_Cover_1.webp";

const EducationCarousel = () => {
  // Using placeholder images for demonstration
  const slides = [
    {
      quote:
        "When did education stop being about becoming, and start being about passing?",
      image: Img1,
    },
    {
      quote:
        "If school is meant to prepare us for life, why does life feel like a separate subject?",
      image: Img2,
    },
    {
      quote:
        "Who decided that education should end at childhood, and learning should stop at the classroom door?",
      image: Img3,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30, scale: 0.95 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.95 },
  };

  return (
    <div
      className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60 z-10" />

      {/* Background images */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={`bg-${currentIndex}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
          }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt="Education scene"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-center w-full max-w-4xl"
          >
            {/* Quote */}
            <motion.h1
              className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed tracking-wide"
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: "0 2px 20px rgba(0,0,0,0.7)",
              }}
            >
              "{slides[currentIndex].quote}"
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-8"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                currentIndex === index
                  ? "bg-white w-8 shadow-lg shadow-white/20"
                  : "bg-white/30 hover:bg-white/50 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-2.5 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-2.5 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default EducationCarousel;
