import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const BlogSection = () => {
  const [expandedArticle, setExpandedArticle] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Passion and Interest Exploration Bot",
      excerpt:
        "Our model guides kids through a cycle of doing and reflecting rather than asking traditional career questions...",
      content: `Whether it's music, animals, or something else entirely — they explore hands-on, reflect on what excites them, and go deeper when it feels meaningful. If not, they try something new.

As real passions emerge, we help connect them to future careers and build the skills to get there.`,
      icon: "🎨",
    },
    {
      id: 2,
      title: "Understanding the Problem",
      excerpt:
        "Why today's education system is fundamentally misaligned with modern needs...",
      content: `It was designed to produce workers who follow rules, memorize facts, and pass standardized tests.
But the world has changed. And school hasn't.

Instead of helping children discover who they are and what they care about, schools are often focused on conformity, competition, and credentials.

Kids are being trained to compete, not contribute.
To follow instructions, not find purpose.
To pass tests, not solve real problems.

The result?
A generation of young people leaving school without the life skills, emotional tools, or clarity they need to thrive.`,
      icon: "🔍",
    },
    {
      id: 3,
      title: "Root Causes of the Crisis",
      excerpt:
        "The deep cultural and systemic issues preventing educational transformation...",
      content: `It runs deeper — into the culture around schools.
So what's really holding us back?

🛑 No Real Demand for Change
Most parents accept the current system as "normal" or "safe," unaware of how much more education could be.

❓Schools Want to Evolve — But Don't Know How
Many educators want to make a shift, but lack the tools, guidance, or working models to take that first step.

😟 Fear of Stepping Outside the System
Even visionary schools hesitate. They fear backlash from parents, regulators, or society at large if they try something bold or unconventional.`,
      icon: "⚠️",
    },
    {
      id: 4,
      title: "The Four Pillars of Our Model",
      excerpt:
        "How we're building classrooms designed for real life, not just exams...",
      content: `Here's how we do it:
1️⃣ Purposeful Academics
We focus only on what truly matters — literacy, numeracy, and communication — taught in meaningful, practical ways.

2️⃣ Essential Life Skills
We teach the habits that help kids thrive through immersive, hands-on experiences.

3️⃣ Community Problem-Solving
Every 6 months, the class takes on a real-world issue to learn empathy and contribution.

4️⃣ Passion & Identity Exploration
We help children explore what excites them and reflect on why it matters to them.`,
      icon: "🏛️",
    },
  ];

  const handleReadMore = (id, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setExpandedArticle(id);
    document.body.style.overflow = "hidden";
  };

  const handleCloseArticle = () => {
    setExpandedArticle(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* ... (keep your existing header code) */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group-hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-4xl mb-4">{post.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">{post.excerpt}</p>
                  <button
                    onClick={(e) => handleReadMore(post.id, e)}
                    className="mt-auto inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {expandedArticle !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleCloseArticle}
              ></motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                  <button
                    onClick={handleCloseArticle}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                  >
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div className="overflow-y-auto flex-grow p-8 sm:p-10">
                    <div className="prose prose-lg max-w-none mx-auto">
                      <div className="text-5xl mb-6">
                        {blogPosts.find((p) => p.id === expandedArticle)?.icon}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {blogPosts.find((p) => p.id === expandedArticle)?.title}
                      </h2>
                      <div className="text-gray-700 whitespace-pre-line">
                        {
                          blogPosts.find((p) => p.id === expandedArticle)
                            ?.content
                        }
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <button
                      onClick={handleCloseArticle}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BlogSection;
