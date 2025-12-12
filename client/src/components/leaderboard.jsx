 const dummyData = [
    { name: "Ash Ketchup", amount: 123 },
    { name: "Professor Oak", amount: 92 },
    { name: "Misty", amount: 75 },
    { name: "Brock", amount:80}
  ];

function Leaderboard(){

    const SortedData = [...dummyData].sort((a,b) => b.amount-a.amount);

    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font semibold mb-4">Top Food Savers</h2>

            <ul className="space-y-2">
        {SortedData.map((user, index) => (
          <li
            key={index}
            className="flex justify-between p-3 bg-gray-100 rounded-md"
          >
            <div className="font-bold">{index + 1}. {user.name}</div>
            <div>{user.amount} kg</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
