import { useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";
import RatingFilter from "./RatingFilter";
import YearFilter from "./YearFilter";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieList = ({ darkMode }) => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [yearRange, setYearRange] = useState({ start: 1900, end: new Date().getFullYear() });
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on init
    const savedFavorites = localStorage.getItem("movieFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Construye el endpoint basado en los filtros actuales
  const buildEndpoint = useCallback(() => {
    // Si hay una búsqueda, usa search endpoint
    if (query && query.trim() !== "") {
      return `/search/movie?query=${query}&vote_average.gte=${minRating}&page=${currentPage}`;
    }
    
    // Si hay un género seleccionado, usa discover con filtro de género
    let endpoint = `/discover/movie?sort_by=popularity.desc&vote_average.gte=${minRating}&vote_count.gte=50&page=${currentPage}`;
    
    if (selectedGenre) {
      endpoint += `&with_genres=${selectedGenre}`;
    }
    
    // Añadir filtro por año
    endpoint += `&primary_release_date.gte=${yearRange.start}-01-01&primary_release_date.lte=${yearRange.end}-12-31`;
    
    return endpoint;
  }, [query, minRating, selectedGenre, yearRange, currentPage]);

  const fetchMovies = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    const endpoint = buildEndpoint();
    
    fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}&language=es-ES`)
      .then((response) => response.json())
      .then((data) => {
        // Verificar si hay resultados
        if (data.results && data.results.length > 0) {
          setMovies(data.results);
          setTotalPages(data.total_pages || 1);
          setTotalResults(data.total_results || 0);
          setHasError(false);
        } else {
          // Si estamos en una página mayor a 1 y no hay resultados, 
          // probablemente es porque la página no existe
          if (currentPage > 1) {
            // Volver a la primera página
            setCurrentPage(1);
            // No mostrar error aquí, ya que se volverá a cargar
          } else {
            setMovies([]);
            setTotalPages(0);
            setTotalResults(0);
            setHasError(true);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener películas:", error);
        setIsLoading(false);
        setHasError(true);
      });
  }, [buildEndpoint, currentPage]);

  useEffect(() => {
    // Save favorites to localStorage whenever it changes
    localStorage.setItem("movieFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Recargar películas cuando cambien los filtros
    if (!showFavorites) {
      fetchMovies();
    }
  }, [query, selectedGenre, minRating, yearRange, currentPage, showFavorites, fetchMovies]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedGenre, minRating, yearRange]);

  const handleSelectGenre = (genreId) => {
    setSelectedGenre(genreId);
    setShowFavorites(false);
  };

  const handleSelectRating = (rating) => {
    setMinRating(rating);
    setShowFavorites(false);
  };

  const handleYearChange = (startYear, endYear) => {
    setYearRange({ start: startYear, end: endYear });
    setShowFavorites(false);
  };

  const handleRandomMovie = () => {
    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      alert(`🎬 Te recomendamos: ${randomMovie.title}`);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setShowFavorites(false);
  };

  const toggleFavorite = (movie) => {
    setFavorites(prevFavorites => {
      // Check if movie is already in favorites
      const exists = prevFavorites.some(fav => fav.id === movie.id);
      
      if (exists) {
        // Remove from favorites
        return prevFavorites.filter(fav => fav.id !== movie.id);
      } else {
        // Add to favorites
        return [...prevFavorites, movie];
      }
    });
  };

  const toggleShowFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  const resetFilters = () => {
    setMinRating(0);
    setSelectedGenre(null);
    setQuery("");
    setYearRange({ start: 1900, end: new Date().getFullYear() });
    setShowFavorites(false);
    setCurrentPage(1);
    setHasError(false);
  };

  // Paginación
  const goToPage = (pageNumber) => {
    // Asegurarse de que la página está dentro de los límites
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
    
    // Scroll al principio de la lista
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const btnClass = darkMode
    ? "bg-blue-600 text-white"
    : "bg-cineRojo text-cineDorado";

  const btnFavClass = darkMode
    ? "bg-yellow-600 text-white"
    : "bg-cineDorado text-cineRojo";

  const paginationBtnClass = (isActive) => {
    return isActive
      ? (darkMode ? "bg-blue-600 text-white" : "bg-cineDorado text-cineRojo")
      : (darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700 text-white hover:bg-gray-600");
  };

  // Determine which movies to display
  const displayedMovies = showFavorites ? favorites : movies;
  const showEmptyMessage = !isLoading && displayedMovies.length === 0;

  // Función para renderizar la paginación
  const renderPagination = () => {
    // No mostrar paginación para favoritos, si solo hay una página o hay un error
    if (showFavorites || totalPages <= 1 || hasError) return null;

    // Calcular rango de páginas a mostrar
    const range = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return (
      <div className="flex justify-center my-6 items-center flex-wrap gap-2">
        {/* Info de paginación */}
        <div className={`${darkMode ? "text-white" : "text-white"} mx-4 text-sm`}>
          Página {currentPage} de {totalPages} 
          <span className="hidden sm:inline"> ({totalResults} resultados)</span>
        </div>
        
        {/* Primera página y anterior */}
        <button 
          onClick={() => goToPage(1)} 
          disabled={currentPage === 1}
          className={`${paginationBtnClass(false)} px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          «
        </button>
        
        <button 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage === 1}
          className={`${paginationBtnClass(false)} px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ‹
        </button>
        
        {/* Números de página */}
        {range.map(page => (
          <button 
            key={page} 
            onClick={() => goToPage(page)}
            className={`${paginationBtnClass(page === currentPage)} px-3 py-1 rounded`}
          >
            {page}
          </button>
        ))}
        
        {/* Siguiente y última */}
        <button 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={`${paginationBtnClass(false)} px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          ›
        </button>
        
        <button 
          onClick={() => goToPage(totalPages)} 
          disabled={currentPage === totalPages}
          className={`${paginationBtnClass(false)} px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          »
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} darkMode={darkMode} />
        
        <div className="mt-4 mb-2">
          <GenreFilter onSelectGenre={handleSelectGenre} darkMode={darkMode} />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="w-full md:w-1/2">
            <RatingFilter 
              onSelectRating={handleSelectRating} 
              currentRating={minRating}
              darkMode={darkMode} 
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <YearFilter 
              onYearChange={handleYearChange}
              currentYearRange={yearRange}
              darkMode={darkMode}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between mt-6 gap-3">
          <button
            onClick={toggleShowFavorites}
            className={`${btnFavClass} px-4 py-2 rounded-lg font-bold`}
          >
            {showFavorites ? "🎬 Ver Catálogo" : "⭐ Ver Favoritos"} 
            {!showFavorites && favorites.length > 0 && ` (${favorites.length})`}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleRandomMovie}
              className={`${btnClass} px-4 py-2 rounded-lg font-bold`}
              disabled={isLoading || displayedMovies.length === 0}
            >
              🎲 Dame Otra
            </button>
            
            <button
              onClick={resetFilters}
              className={`${darkMode ? "bg-gray-600" : "bg-gray-700"} text-white px-4 py-2 rounded-lg font-bold`}
            >
              🔄 Resetear Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Información de resultados cuando no estamos en favoritos */}
      {!showFavorites && !isLoading && movies.length > 0 && !hasError && (
        <div className={`text-center py-2 ${darkMode ? "text-white" : "text-white"} text-sm`}>
          Mostrando {movies.length} películas de {totalResults} resultados
        </div>
      )}
      
      {isLoading && !showFavorites ? (
        <div className="text-center py-8">
          <p className="text-white">Cargando películas...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  darkMode={darkMode} 
                  isFavorite={favorites.some(fav => fav.id === movie.id)}
                  onToggleFavorite={() => toggleFavorite(movie)}
                  apiKey={API_KEY}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-white text-lg">
                  {showFavorites 
                    ? "No tienes películas favoritas 💔" 
                    : "No se encontraron películas con estos filtros 😢"}
                </p>
                {!showFavorites && (
                  <button 
                    onClick={resetFilters}
                    className={`${btnClass} px-4 py-2 rounded-lg font-bold mt-4`}
                  >
                    Resetear Filtros
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Paginación - solo se muestra si hay películas o estamos cargando */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default MovieList;