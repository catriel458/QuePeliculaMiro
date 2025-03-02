import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MovieCard = ({ movie, darkMode, isFavorite, onToggleFavorite, apiKey }) => {
  const [showModal, setShowModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  
  const cardBgClass = darkMode
    ? "bg-gray-800 border-blue-400"
    : "bg-cineRojo border-cineDorado";
  
  const cardTextClass = darkMode
    ? "text-gray-100"
    : "text-white";

  // Fetch movie trailer when modal opens
  useEffect(() => {
    if (showModal && !trailerKey && !isLoadingTrailer) {
      fetchMovieTrailer();
    }
  }, [showModal]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMovieTrailer = () => {
    setIsLoadingTrailer(true);
    
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=es-ES`)
      .then(response => response.json())
      .then(data => {
        // Look for official trailers first
        const trailers = data.results || [];
        
        // Find Spanish trailer first, then any trailer
        const spanishTrailer = trailers.find(video => 
          (video.type === "Trailer" && video.site === "YouTube" && video.iso_639_1 === "es")
        );
        
        const anyTrailer = trailers.find(video => 
          (video.type === "Trailer" && video.site === "YouTube")
        );
        
        // Fall back to any video if no trailers
        const anyVideo = trailers.find(video => video.site === "YouTube");
        
        setTrailerKey(spanishTrailer?.key || anyTrailer?.key || anyVideo?.key || null);
        setIsLoadingTrailer(false);
      })
      .catch(error => {
        console.error("Error fetching trailer:", error);
        setIsLoadingTrailer(false);
      });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${cardBgClass} ${cardTextClass} p-4 rounded-2xl shadow-lg border-4 relative`}
      >
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-6 right-6 bg-black bg-opacity-70 rounded-full p-2 z-10 transition-transform hover:scale-110"
        >
          {isFavorite ? (
            <span className="text-xl" role="img" aria-label="Eliminar de favoritos">
              ⭐
            </span>
          ) : (
            <span className="text-xl" role="img" aria-label="Añadir a favoritos">
              ☆
            </span>
          )}
        </button>

        {/* Movie Poster */}
        {movie.poster_path ? (
          <img
            className="rounded-lg w-full h-64 object-cover cursor-pointer"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            onClick={() => setShowModal(true)}
          />
        ) : (
          <div 
            className="rounded-lg w-full h-64 bg-gray-800 flex items-center justify-center cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <span className="text-xl">🎬 Sin imagen</span>
          </div>
        )}

        {/* Movie Info */}
        <div className="mt-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">{movie.title}</h3>
            <span className="bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          </div>
          
          <p className="text-sm opacity-80 my-2">
            {movie.release_date?.slice(0, 4) || "N/A"}
          </p>
          
          <p className="text-sm opacity-80 mb-2">
            {movie.overview?.slice(0, 100)}
            {movie.overview?.length > 100 ? "..." : ""}
          </p>
          
          <div className="flex gap-2">
            {movie.overview?.length > 100 && (
              <button
                onClick={() => setShowModal(true)}
                className={`${darkMode ? "bg-blue-600" : "bg-cineDorado"} ${darkMode ? "text-white" : "text-cineRojo"} px-3 py-1 rounded text-sm font-bold mt-1`}
              >
                Ver más
              </button>
            )}
            
            <button
              onClick={() => {
                setShowModal(true);
                if (!trailerKey && !isLoadingTrailer) {
                  fetchMovieTrailer();
                }
              }}
              className={`${darkMode ? "bg-red-600" : "bg-red-700"} text-white px-3 py-1 rounded text-sm font-bold mt-1 flex items-center gap-1`}
            >
              <span>▶</span> Trailer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Movie Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-cineRojo"} p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative`}>
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 z-20"
            >
              <span className="text-white text-xl">&times;</span>
            </button>
            
            {/* Favorite Button in Modal */}
            <button
              onClick={onToggleFavorite}
              className="absolute top-4 right-16 bg-black bg-opacity-50 rounded-full p-2 transition-transform hover:scale-110 z-20"
            >
              {isFavorite ? (
                <span className="text-xl" role="img" aria-label="Eliminar de favoritos">
                  ⭐
                </span>
              ) : (
                <span className="text-xl" role="img" aria-label="Añadir a favoritos">
                  ☆
                </span>
              )}
            </button>

            <h2 className="text-xl font-bold mb-4 pr-20">{movie.title}</h2>
            
            {/* Trailer Section */}
            {isLoadingTrailer ? (
              <div className="w-full aspect-video bg-black flex items-center justify-center mb-4">
                <p className="text-white">Cargando trailer...</p>
              </div>
            ) : trailerKey ? (
              <div className="mb-4 relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video bg-black flex items-center justify-center mb-4">
                <p className="text-white">No se encontró trailer disponible</p>
              </div>
            )}
            
            <div className="flex gap-4 mb-4">
              {movie.poster_path && (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-1/3 rounded"
                />
              )}
              <div>
                <p className="text-sm mb-2">⭐ {movie.vote_average}/10</p>
                <p className="text-sm mb-2">📅 {movie.release_date || "Fecha desconocida"}</p>
                {movie.genres && (
                  <p className="text-sm mb-2">
                    🎭 {movie.genres.map(g => g.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
            
            <h3 className="font-bold mb-2">Sinopsis</h3>
            <p className="mb-6">{movie.overview || "No hay sinopsis disponible."}</p>
            
            <button
              onClick={() => setShowModal(false)}
              className={`${darkMode ? "bg-blue-600" : "bg-cineDorado"} ${darkMode ? "text-white" : "text-cineRojo"} px-4 py-2 rounded font-bold`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;