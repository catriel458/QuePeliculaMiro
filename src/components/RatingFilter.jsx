// RatingFilter.jsx - Versión mejorada con feedback visual
import { useState, useEffect } from "react";

const RatingFilter = ({ onSelectRating, currentRating, darkMode }) => {
  const [tempRating, setTempRating] = useState(currentRating);
  const [isChanging, setIsChanging] = useState(false);
  
  // Sincroniza el tempRating con currentRating cuando cambia desde fuera
  useEffect(() => {
    if (!isChanging) {
      setTempRating(currentRating);
    }
  }, [currentRating, isChanging]);

  // Función para manejar el cambio del slider
  const handleSliderChange = (e) => {
    setIsChanging(true);
    setTempRating(parseFloat(e.target.value));
  };
  
  // Función para aplicar el filtro cuando se suelta el slider
  const handleSliderRelease = () => {
    setIsChanging(false);
    onSelectRating(tempRating);
  };
  
  // Define clases según el modo y valor
  const getStarColor = (value) => {
    if (value >= 8) return "text-yellow-400"; // Excelente
    if (value >= 6) return "text-yellow-600"; // Bueno
    if (value >= 4) return "text-yellow-700"; // Regular
    return "text-gray-400"; // Bajo
  };
  
  // Convierte el valor a estrellas visuales
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex text-lg">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={getStarColor(rating)}>★</span>
        ))}
        {halfStar && <span className={getStarColor(rating)}>✫</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-500">☆</span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col p-3 bg-gray-800 bg-opacity-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">Calificación mínima:</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${getStarColor(tempRating)}`}>
            {tempRating.toFixed(1)}
          </span>
          {renderStars(tempRating)}
        </div>
      </div>
      
      <div className="relative mt-1 mb-3">
        <div className="h-1 w-full bg-gray-700 rounded-full absolute top-1/2 transform -translate-y-1/2"></div>
        {/* Marcas de valores */}
        {[0, 2, 4, 6, 8, 10].map((mark) => (
          <div 
            key={mark} 
            className="absolute h-3 w-1 bg-gray-500" 
            style={{ 
              left: `${mark * 10}%`, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }}
          ></div>
        ))}
        
        {/* Línea de progreso */}
        <div 
          className={`h-1 rounded-full absolute top-1/2 transform -translate-y-1/2 ${getStarColor(tempRating)}`}
          style={{ 
            width: `${tempRating * 10}%`, 
            transition: 'width 0.2s ease'
          }}
        ></div>
      </div>
      
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={tempRating}
        onChange={handleSliderChange}
        onMouseUp={handleSliderRelease}
        onTouchEnd={handleSliderRelease}
        className="w-full h-6 bg-transparent appearance-none cursor-pointer"
        style={{
          // Estiliza el thumb del slider
          WebkitAppearance: 'none',
          background: 'transparent',
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>0</span>
        <span>2</span>
        <span>4</span>
        <span>6</span>
        <span>8</span>
        <span>10</span>
      </div>
      
      {/* Botones de filtro rápido */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {[0, 5, 6, 7, 8, 9].map((rating) => (
          <button
            key={rating}
            onClick={() => {
              setTempRating(rating);
              onSelectRating(rating);
            }}
            className={`px-2 py-1 text-xs rounded ${
              tempRating === rating 
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-cineRojo text-cineDorado font-bold' 
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-800 text-gray-300'
            } transition-colors`}
          >
            {rating === 0 ? 'Todos' : `${rating}+`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;