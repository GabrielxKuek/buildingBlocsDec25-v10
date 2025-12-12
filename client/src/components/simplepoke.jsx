// Pokemon evolves based on milestones reached 
function Pokemon({ foodSaved }) {
  let pokemonId;
  let pokemonName;
  let nextEvolution;

  if (foodSaved < 100) {
    pokemonId = 4; // Charmander
    pokemonName = "Charmander";
    nextEvolution = 100;
  } else if (foodSaved < 300) {
    pokemonId = 5; // Charmeleon
    pokemonName = "Charmeleon";
    nextEvolution = 300;
  } else {
    pokemonId = 6; // Charizard
    pokemonName = "Charizard";
    nextEvolution = null;
  }

  const progress = (foodSaved / 300) * 100;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Community Progress</h2>
      
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Pokemon Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50"></div>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
            alt="pokemon"
            className="w-48 h-48 relative z-10"
          />
        </div>

        {/* Pokemon Name */}
        <h3 className="text-2xl font-bold text-gray-800 mt-4">{pokemonName}</h3>
        
        {/* Progress Bar */}
        <div className="w-full max-w-sm mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{foodSaved} / 300 kg</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          
          {nextEvolution && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {nextEvolution - foodSaved} kg until next evolution! 🔥
            </p>
          )}
          {!nextEvolution && (
            <p className="text-xs text-green-600 mt-2 text-center font-medium">
              Maximum level reached! 🎉
            </p>
          )}
        </div>

        {/* Community Stats */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full max-w-sm">
          <p className="text-sm text-gray-600 text-center">
            Total Food Saved by Community
          </p>
          <p className="text-3xl font-bold text-green-600 text-center mt-1">
            {foodSaved} kg
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pokemon;