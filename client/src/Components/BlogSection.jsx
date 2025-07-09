import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const BlogSection = () => {
  const [expandedArticle, setExpandedArticle] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Passion and Interest Exploration Bot",
      excerpt:
        "Instead of asking 'What do you want to be when you grow up?', our model guides kids through a cycle of doing and reflecting...",
      content: `Whether it's music, animals, or something else entirely — they explore hands-on, reflect on what excites them, and go deeper when it feels meaningful. If not, they try something new.

As real passions emerge, we help connect them to future careers and build the skills to get there.`,
    },
    {
      id: 2,
      title: "Understanding the Problem",
      excerpt:
        "Today's education system is stuck in the past. It was designed for the industrial age...",
      content: `It was designed to produce workers who follow rules, memorize facts, and pass standardized tests.
But the world has changed. And school hasn't.

Instead of helping children discover who they are and what they care about, schools are often focused on conformity, competition, and credentials.

Kids are being trained to compete, not contribute.
To follow instructions, not find purpose.
To pass tests, not solve real problems.

The result?
A generation of young people leaving school without the life skills, emotional tools, or clarity they need to thrive. They're not being empowered to shape their own lives — they're being shaped to fit a mold.

We believe education should be about human flourishing — helping children live meaningful, capable, and contributive lives.`,
    },
    {
      id: 3,
      title: "Root Causes of the Crisis",
      excerpt:
        "The problem with education isn't just outdated textbooks or rigid policies...",
      content: `It runs deeper — into the culture around schools.
So what's really holding us back?

🛑 No Real Demand for Change
Most parents accept the current system as "normal" or "safe," unaware of how much more education could be.

❓Schools Want to Evolve — But Don't Know How
Many educators want to make a shift, but lack the tools, guidance, or working models to take that first step.

😟 Fear of Stepping Outside the System
Even visionary schools hesitate. They fear backlash from parents, regulators, or society at large if they try something bold or unconventional.

The result?
Progress is stuck — caught between cultural complacency, capability gaps, and collective fear.
It's time to break the cycle.`,
    },
    {
      id: 4,
      title: "The Four Pillars of Your Classroom Model",
      excerpt:
        "We're building a classroom designed for real life, not just exams...",
      content: `Here's how we do it:
1️⃣ Purposeful Academics
We focus only on what truly matters — literacy, numeracy, and communication — taught in meaningful, practical ways.
No irrelevant content
No one-size-fits-all pace
Real-world applications
Examples: Math through budgeting games. English through storytelling and roleplay.
Children learn at their own pace, with purpose.

2️⃣ Essential Life Skills
We teach the habits that help kids thrive — not through lectures, but through immersive, hands-on experiences.
These skills are practiced, reflected on, and integrated into daily life.

3️⃣ Community Problem-Solving
Every 6 months, the class takes on a real-world issue — like waste segregation or helping a lonely neighbor.
They learn empathy, confidence, and how to be contributing citizens from an early age.

4️⃣ Passion & Identity Exploration
Instead of asking, "What do you want to be?", we help children explore what excites them — and reflect on why.
🎵 Love music? Try an instrument.
🐾 Curious about animals? Care for a pet.
Then reflect: Did this light you up? If yes, go deeper. If not, try something new.

Over time, we help connect interests to skills, careers, and purpose.
This is learning that prepares kids not just for tests — but for life.`,
    },
  ];

  const handleReadMore = (id) => {
    setExpandedArticle(id);
    document.body.style.overflow = "hidden";
  };

  const handleCloseArticle = () => {
    setExpandedArticle(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Our Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">{post.excerpt}</p>
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="mt-auto w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Read More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {expandedArticle !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 bg-gray-900 bg-opacity-75"
                    onClick={handleCloseArticle}
                  ></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                >
                  <div className="bg-white px-6 py-8 sm:p-8">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {blogPosts.find((p) => p.id === expandedArticle)?.title}
                      </h3>
                      <button
                        onClick={handleCloseArticle}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                      {blogPosts.find((p) => p.id === expandedArticle)?.content}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 sm:px-8 flex justify-end">
                    <button
                      onClick={handleCloseArticle}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BlogSection;
