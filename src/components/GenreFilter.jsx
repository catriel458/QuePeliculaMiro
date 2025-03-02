// GenreFilter.jsx con soporte para modo oscuro
const GenreFilter = ({ onSelectGenre, darkMode }) => {
  const genres = [
    { id: 28, name: "Acción" },
    { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Ciencia ficción" },
  ];

  const btnClass = darkMode 
    ? "bg-gray-700 hover:bg-blue-600 text-white" 
    : "bg-gray-800 hover:bg-cineRojo text-white";

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`${btnClass} px-3 py-1 rounded-full text-sm transition-colors`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;