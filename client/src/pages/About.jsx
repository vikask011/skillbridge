import React, { useState } from "react";

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState("");

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto rounded-xl shadow-xl bg-white p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 mb-6">
          About Us
        </h1>

        <p className="text-black text-lg mb-4">
          Welcome to <span className="font-semibold">SkillBridge</span> — a skill-sharing
          platform built with the vision to connect learners and teachers in an interactive
          environment. Our mission is to empower students to teach what they know and learn
          what they love.
        </p>

        <p className="text-black text-lg mb-4">
          We believe everyone has a unique skill to offer. Our platform helps students swap
          skills, schedule sessions, give peer feedback, and grow together in a trusted and
          collaborative community.
        </p>

        <p className="text-black text-lg mb-4">
          Whether it's coding, painting, music, or public speaking — <strong>SkillBridge</strong> is your
          space to teach, learn, and evolve.
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connect With Us</h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => toggleSection("github")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              GitHub
            </button>
            <button
              onClick={() => toggleSection("linkedin")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              LinkedIn
            </button>
            <button
              onClick={() => toggleSection("email")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Email
            </button>
          </div>

          {activeSection === "github" && (
            <div className="mt-4 flex gap-6 text-blue-600 underline">
              <a
                href="https://github.com/vikask011"
                target="_blank"
                rel="noopener noreferrer"
              >
               https://github.com/vikask011
              </a>
              <a
                href="https://github.com/maheshN1821"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/maheshN1821
              </a>
            </div>
          )}

          {activeSection === "linkedin" && (
            <div className="mt-4 flex gap-6 text-blue-600 underline">
              <a
                href="https://linkedin.com/in/vikas-k-95o"
                target="_blank"
                rel="noopener noreferrer"
              >
               https://linkedin.com/in/vikas-k-95o
              </a>
              <a
                href="linkedin.com/in/mahesh-18-n"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/mahesh-18-n
              </a>
            </div>
          )}

          {activeSection === "email" && (
            <div className="mt-4 flex gap-6 text-black">
              <a href="mailto:vikask011@gmail.com" className="underline">
                vikas95116@gmail.com
              </a>
              <a href="mailto:maheshn0418@gmail.com" className="underline">
                maheshn1821@gmail.com
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
