import React from "react";


 // Pokemon evolves based on milestones reached 
function Pokemon({ foodSaved }) {

  let pokemonId;

  if (foodSaved < 100) {
    pokemonId = 4; // Charmander
  } else if (foodSaved < 300) {
    pokemonId = 5; // Charmeleon
  } else {
    pokemonId = 6; // Charizard
  }

const progress = (foodSaved / 300) * 100;

  return (
    <div className="flex flex-col">
  <img
    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
    alt="pokemon"
    className="w-100 h-100 mx-auto"
  />

  <div className="w-64 bg-gray-200 h-4 rounded-full mt-4 mx-auto">
    <div
      className="bg-green-500 h-full rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>

  <p className="mt-2 font-medium text-center">Food Saved by users: {foodSaved} kg</p>
</div>

  );
}

export default Pokemon;
