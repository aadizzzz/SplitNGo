import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { findRoutes } from "../utils/findRoutes";

export default function ResultsPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const source = params.get("source");
  const destination = params.get("destination");

  const [directTrains, setDirectTrains] = useState([]);
  const [splitTrains, setSplitTrains] = useState([]);

  useEffect(() => {
    const { direct, split } = findRoutes(source, destination);
    setDirectTrains(direct);
    setSplitTrains(split);
  }, [source, destination]);

  return (
    <div className="font-lora">
      <div className="min-h-screen bg-gray-950 text-white px-6 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-6">
        Search Results: <span className="text-white">{source} ➜ {destination}</span>
      </h2>

      {/* 🚆 Direct Trains */}
      <section>
        <h3 className="text-2xl text-blue-400 mb-4 border-b border-blue-400 pb-1">🚆 Direct Trains</h3>
        {directTrains.length === 0 ? (
          <p className="text-red-400 italic">No direct trains found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {directTrains.map((r, index) => (
              <div
                key={index}
                className="bg-blue-900 rounded-2xl p-4 shadow-md hover:shadow-blue-500/30 transition duration-200"
              >
                <h4 className="text-xl font-semibold text-blue-200">{r.train.name}</h4>
                <p className="text-white mt-1">{r.from} ➜ {r.to}</p>
                <p className="text-sm text-blue-300 mt-1">Dep: {r.train.departure} • Arr: {r.train.arrival}</p>
                <p className="text-xs text-gray-400">Train ID: {r.train.id}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔁 Split-in-Same-Train */}
      <section>
        <h3 className="text-2xl text-yellow-400 mb-4 border-b border-yellow-400 pb-1">🔁 Split Journey (Same Train)</h3>
        {splitTrains.length === 0 ? (
          <p className="text-red-400 italic">No split-journey trains found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {splitTrains.map((r, index) => (
              <div
                key={index}
                className="bg-yellow-900 rounded-2xl p-4 shadow-md hover:shadow-yellow-500/30 transition duration-200"
              >
                <h4 className="text-xl font-semibold text-yellow-200">{r.train.name}</h4>
                <p className="text-white mt-1">{r.from} ➜ {r.to}</p>
                <p className="text-sm text-yellow-300 mt-1">Dep: {r.train.departure} • Arr: {r.train.arrival}</p>
                <p className="text-xs text-gray-400">Train ID: {r.train.id}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </div>
  );
}
