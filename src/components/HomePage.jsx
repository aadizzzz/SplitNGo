import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source || !destination) return;
    navigate(`/results?source=${source}&destination=${destination}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-lora">
      {/* 🚩 HEADER SECTION */}
      <header className="flex items-center px-6 py-4 border-b border-gray-800">
        <img src="/logo.png" alt="SplitNGo Logo" className="h-10 w-10 mr-3" />
        <div>
          <h1 className="text-xl font-bold text-cyan-400">SplitNGo</h1>
          <p className="text-sm text-gray-400 -mt-1">Every Route. Every Possibility.</p>
        </div>
      </header>

      {/* 🌐 MAIN PAGE CONTENT */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-300 text-center">
            Plan Your Smart Journey
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Source Station</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Kanpur"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Destination Station</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Varanasi"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              🔍 Search Trains
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12 text-sm font-lora">
        <p>This project is a Mini Project</p>
        <p>Created by - Aditya Dhiman, MCA 3rd Semester, 2nd Year.</p>
        <p>Chhatrapati Shahu Ji Maharaj University, Kanpur</p>
      </footer>
    </div>
  );
}
