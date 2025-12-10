import React from "react";

function Evolve({ foodSaved }) {
  const scale = 1 + foodSaved / 100;

  
  let pokemonId;

  if (foodSaved < 100) {
    pokemonId = 4; // Charmander
  } else if (foodSaved < 300) {
    pokemonId = 5; // Charmeleon
  } else {
    pokemonId = 6; // Charizard
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="transition-all duration-500"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {/* Pokémon Sprite */}
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
          alt="Pokemon"
          className="w-32 h-32"
          style={{ objectFit: "contain" }}
        />
      </div>

      <p className="mt-4 text-lg font-semibold">
        Food Saved: {foodSaved} kg
      </p>
    </div>
  );
}

export default Evolve;

