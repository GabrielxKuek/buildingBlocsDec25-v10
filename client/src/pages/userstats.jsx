import React, { useState } from "react";
import Pokemon from "../components/simplepoke";
import StatsCard from "../components/StatsCard";
import Leaderboard from "../components/Leaderboard";

let indvfoodSaved=10
let indvfoodDonated=10

export default function Statspage() {
  const [foodSaved, setfoodSaved] = useState(90);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      

        {/* Add food saved button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setfoodSaved(foodSaved + 10)}
            className="px-4 py-2 rounded-lg shadow !bg-green-500 !text-white"
          >
            +10 Food Saved
          </button>
        </div>

        {/* Top section: Pokemon + Summary */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-start max-w-full">

  {/* Left: Pokemon + progress */}
  <div className="flex flex-col">
    <Pokemon foodSaved={foodSaved} />
  </div>

  {/* Right: Stats summary */}
  <div className="w-full">
    <StatsCard
      indvfoodSaved={indvfoodSaved}
      indvfoodDonated={indvfoodDonated}
    />
  </div>

</div>

        {/* Leaderboard full width under everything */}
        <div className="mt-14 w-full">
          <Leaderboard />
        </div>

      
    </div>
  );
}
