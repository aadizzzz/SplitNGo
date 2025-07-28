import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/landing-bg.png"; // ✅ Ensure this path is correct

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div className="relative min-h-screen text-white font-lora overflow-hidden">
      {/* Background Blur Layer */}
      <div
        className="absolute inset-0 bg-center bg-repeat bg-cover blur-md opacity-90"
        style={{ backgroundImage: `url(${bgImage})`, zIndex: 0 }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="w-full px-6 py-4 bg-gray-900 shadow-md flex items-center justify-between">
          <div className="text-2xl font-bold text-cyan-400">SplitNGo</div>
          <div className="text-sm text-gray-300 italic">Every Route. Every Possibility.</div>
        </header>

        {/* Hero Section */}
        <section data-aos="fade-up">
          <div className="flex flex-col items-center justify-center text-center py-20 px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 mb-3">SplitNGo</h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10 italic">Every Route. Every Possibility.</p>
          </div>
        </section>

        {/* Main Info Section */}
        <main className="flex-grow px-6 md:px-24 text-center">
          {/* About the Project Section */}
          <section data-aos="fade-up" className="mb-16">
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6">About the Project</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              <strong>SplitNGo</strong> is a smart, React-based journey planner developed by <strong>Aditya Dhiman</strong>, an MCA student (3rd Semester, 2nd Year) at <strong>Chhatrapati Shahu Ji Maharaj University, Kanpur</strong>. Designed as a Mini Project for the MCA curriculum, SplitNGo addresses a common limitation in most travel portals: the inability to suggest travel routes when no direct train is available.
              <br /><br />
              This project intelligently recommends journeys by identifying <em>split segments within the same train</em> or suggesting <em>alternative combinations</em> when direct options don’t exist. While IRCTC and similar platforms often stop at "No trains found," SplitNGo goes further — showing <strong>"Split in Same Train"</strong> or <strong>"Multi-Train Layover"</strong> routes using graph-based traversal logic.
              <br /><br />
              This Project is also just a dummy project for showcasing how I am going to solve the problem and it will be upgraded to a Major Project in the Final Semester with real-life scenarios and complete working and solving issues.
            </p>
          </section>

          {/* Technologies Section */}
          <section data-aos="fade-up" className="mb-16">
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6">Technologies Used</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              The project is built using <strong>ReactJS</strong> for UI development, <strong>Tailwind CSS</strong> for styling, and <strong>React Router</strong> for page navigation. Logic for routing is implemented through custom JavaScript using <strong>BFS (Breadth First Search)</strong> and graph traversal for smart route identification. The entire project is modular, clean, and responsive.
            </p>
          </section>

          {/* About the Author Section */}
          <section data-aos="fade-up" className="mb-16">
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6">About the Author</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              My name is <strong>Aditya Dhiman</strong>, a student of MCA (3rd Semester, 2nd Year) at <strong>Chhatrapati Shahu Ji Maharaj University, Kanpur</strong>. I’m passionate about building meaningful tech solutions that solve real-world problems. My goal with SplitNGo was to simplify and improve the way train route suggestions work in India — especially for routes where direct trains aren’t available.
            </p>
          </section>

          {/* Problem Statement Section */}
          <section data-aos="fade-up" className="mb-16">
            <h2 className="text-3xl font-semibold text-cyan-400 mb-6">Problem This Project Solves</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Traditional railway platforms like IRCTC fail to show alternative suggestions if no direct train is found. SplitNGo solves this by checking split routes within the same train or using multiple trains with logical layovers to complete a journey. It ensures that users are always given the best possible travel options, instead of a dead-end result.
            </p>
          </section>

          {/* CTA Section */}
          <div data-aos="fade-up" className="mb-20">
            <button
              onClick={() => navigate("/home")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg shadow-xl transition"
            >
              Plan My Journey
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer data-aos="fade-up" className="bg-gray-950 text-center py-8 text-gray-400 text-sm">
          <h2 className="text-2xl text-cyan-400 font-bold mb-1">SplitNGo</h2>
          <p className="italic text-gray-300 mb-4">Every Route. Every Possibility.</p>
          <p>This project is a Mini Project</p>
          <p>Created by - Aditya Dhiman, MCA 3rd Semester, 2nd Year.</p>
          <p>Chhatrapati Shahu Ji Maharaj University, Kanpur</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
