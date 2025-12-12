import React from "react";
import { Trophy, Medal } from "lucide-react";

function Leaderboard() {
  // Sample leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", foodSaved: 45, foodDonated: 38 },
    { rank: 2, name: "Michael Tan", foodSaved: 42, foodDonated: 35 },
    { rank: 3, name: "Priya Kumar", foodSaved: 38, foodDonated: 32 },
    { rank: 4, name: "David Lim", foodSaved: 35, foodDonated: 28 },
    { rank: 5, name: "Emily Wong", foodSaved: 32, foodDonated: 25 },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 border-yellow-300";
    if (rank === 2) return "bg-gray-100 border-gray-300";
    if (rank === 3) return "bg-orange-100 border-orange-300";
    return "bg-white border-gray-200";
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Leaderboard</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Top contributors in the community</p>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(
              user.rank
            )}`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 flex items-center justify-center font-bold text-lg">
                {getRankBadge(user.rank)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Saved: {user.foodSaved} kg</span>
                  <span>Donated: {user.foodDonated} kg</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {user.foodSaved + user.foodDonated}
              </div>
              <div className="text-xs text-gray-500">total kg</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          Keep sharing to climb the leaderboard! 🌟
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;