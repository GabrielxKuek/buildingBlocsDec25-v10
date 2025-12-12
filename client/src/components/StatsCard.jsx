function StatsCard({ indvfoodSaved, indvfoodDonated }) {
  const indvtotal = indvfoodSaved + indvfoodDonated;

  // Meal equivalent of the total (assuming 0.5kg is 1 meal)
  const meals = Math.round(indvtotal / 0.5);

  // Achievements for each user 
  let achievement;
  if (indvtotal >= 30) achievement = "Gold";
  else if (indvtotal >= 10) achievement = "Silver";
  else achievement = "Bronze";

  // sample Tips of the Day for each user
  const tips = [
    "Overripe fruits can be blended into smoothies, milkshakes, or used in baking (e.g., banana bread).",
    "Buy only what you need — plan meals ahead.",
    "When storing new groceries, move older items to the front of the fridge or pantry so they are used first.",
    "Items like potatoes, onions, garlic, and whole pumpkins prefer cool, dark, and dry places like a pantry or cupboard, not the fridge.",
  ];

  // Pick a random tip from the tips list
  const randomIndex = Math.floor(Math.random() * tips.length);
  const tipOfTheDay = tips[randomIndex];

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>

      <div className="space-y-3">
        {/* Stats rows */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Food Saved</span>
          <span className="text-green-600 font-bold">{indvfoodSaved} kg</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Food Donated</span>
          <span className="text-green-600 font-bold">{indvfoodDonated} kg</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Meals Equivalent</span>
          <span className="text-green-600 font-bold">{meals} meals</span>
        </div>

        {/* Achievement badge */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Achievement</span>
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
              {achievement}
            </span>
          </div>
        </div>

        {/* Tip of the day */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
          <h3 className="text-sm font-semibold text-green-800 mb-2">💡 Tip of the Day</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{tipOfTheDay}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;