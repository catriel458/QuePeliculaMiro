import { useState } from "react";

const SearchBar = ({ onSearch, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const inputBgClass = darkMode 
    ? "bg-gray-700 border-blue-400" 
    : "bg-gray-800 border-cineDorado";
  
  const btnClass = darkMode 
    ? "bg-blue-600 text-white" 
    : "bg-cineRojo text-cineDorado";

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar películas..."
        className={`${inputBgClass} text-white p-2 rounded-lg border-2 flex-grow`}
      />
      <button
        type="submit"
        className={`${btnClass} px-4 py-2 rounded-lg font-bold`}
      >
        🔍 Buscar
      </button>
    </form>
  );
};

export default SearchBar;