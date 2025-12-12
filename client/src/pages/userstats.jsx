import { useState } from "react";
import Pokemon from "../components/simplepoke";
import StatsCard from "../components/StatsCard";
import Leaderboard from "../components/Leaderboard";

let indvfoodSaved = 10;
let indvfoodDonated = 10;

export default function Statspage() {
  const [foodSaved, setfoodSaved] = useState(90);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="./logo.png" className="h-12" alt="FoodShare Logo" />
              {/* <img src="./appName.png" className="h-12" alt="FoodShare" /> */}
              <div>
                <h1 className="text-3xl font-bold text-green-600">FoodShare</h1>
                <p className="text-gray-600 text-sm">Reducing waste, sharing care</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Impact</h2>
          <p className="text-sm text-gray-600">Track your progress and see how you're making a difference</p>
        </div>

        {/* Add food saved button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setfoodSaved(foodSaved + 10)}
            className="px-6 py-3 rounded-lg shadow-md bg-green-600 hover:bg-green-700 transition-colors text-white font-medium"
          >
            +10 Food Saved
          </button>
        </div>

        {/* Top section: Pokemon + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Pokemon + progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Pokemon foodSaved={foodSaved} />
          </div>

          {/* Right: Stats summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <StatsCard
              indvfoodSaved={indvfoodSaved}
              indvfoodDonated={indvfoodDonated}
            />
          </div>
        </div>

        {/* Leaderboard full width under everything */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}