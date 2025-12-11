import React, { useState } from "react";
import Pokemon from "../components/simplepoke";
import StatsCard from "../components/StatsCard";
import Leaderboard from "../components/Leaderboard";

let indvfoodSaved=10
let indvfoodDonated=10

export default function Statspage() {
  // Food saved state (for demo)
  const [foodSaved, setfoodSaved] = useState(90);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* DEMO add food saved value button*/}
      <div className="flex justify-center">
        
        <button
          onClick={() => setfoodSaved(foodSaved + 10)}
          className="px-4 py-2 rounded-lg shadow !bg-green-500 !text-white"
        >
          +10 Food Saved
        </button>
      </div>

      {/* Top row: Pokemon + StatsCard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 flex flex-col items-center">
          <Pokemon foodSaved={foodSaved} />
        </div>

        <div className="w-full md:w-1/3">
          <StatsCard
            indvfoodSaved={indvfoodSaved}
            indvfoodDonated={indvfoodDonated}
          />
        </div>
      </div>

      {/* Leaderboard below */}
      <div className="w-full">
        <Leaderboard />
      </div>
    </div>
  );
}