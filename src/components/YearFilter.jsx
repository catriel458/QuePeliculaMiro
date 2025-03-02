import { useState, useEffect } from "react";

const YearFilter = ({ onYearChange, currentYearRange, darkMode }) => {
  const [startYear, setStartYear] = useState(currentYearRange?.start || 1900);
  const [endYear, setEndYear] = useState(currentYearRange?.end || new Date().getFullYear());
  
  const currentYear = new Date().getFullYear();
  
  // Common decades for quick selection
  const decades = [
    { label: "Todas", start: 1900, end: currentYear },
    { label: "Años 70s", start: 1970, end: 1979 },
    { label: "Años 80s", start: 1980, end: 1989 },
    { label: "Años 90s", start: 1990, end: 1999 },
    { label: "2000s", start: 2000, end: 2009 },
    { label: "2010s", start: 2010, end: 2019 },
    { label: "2020s", start: 2020, end: currentYear }
  ];
  
  useEffect(() => {
    // Update the inputs if the props change
    if (currentYearRange) {
      setStartYear(currentYearRange.start);
      setEndYear(currentYearRange.end);
    }
  }, [currentYearRange]);

  const handleApplyFilter = () => {
    onYearChange(Number(startYear), Number(endYear));
  };
  
  const handleDecadeSelect = (start, end) => {
    setStartYear(start);
    setEndYear(end);
    onYearChange(start, end);
  };

  const btnClass = darkMode 
    ? "bg-blue-600 text-white" 
    : "bg-cineRojo text-cineDorado";
  
  const chipClass = darkMode
    ? "bg-gray-700 hover:bg-blue-600 text-white"
    : "bg-gray-800 hover:bg-cineDorado hover:text-cineRojo text-white";
  
  const labelClass = darkMode 
    ? "text-white" 
    : "text-cineDorado";

  return (
    <div>
      <label className={`block mb-2 font-medium ${labelClass}`}>
        Filtrar por Año 📅
      </label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {decades.map((decade) => (
          <button
            key={decade.label}
            onClick={() => handleDecadeSelect(decade.start, decade.end)}
            className={`${chipClass} px-3 py-1 rounded-full text-sm transition`}
          >
            {decade.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        <div>
          <label htmlFor="startYear" className={`block text-sm mb-1 ${labelClass}`}>
            Desde
          </label>
          <input
            id="startYear"
            type="number"
            min="1900"
            max={endYear}
            value={startYear}
            onChange={(e) => setStartYear(Math.min(Number(e.target.value), endYear))}
            className="w-24 px-2 py-1 bg-gray-700 text-white rounded"
          />
        </div>
        
        <div>
          <label htmlFor="endYear" className={`block text-sm mb-1 ${labelClass}`}>
            Hasta
          </label>
          <input
            id="endYear"
            type="number"
            min={startYear}
            max={currentYear}
            value={endYear}
            onChange={(e) => setEndYear(Math.max(Number(e.target.value), startYear))}
            className="w-24 px-2 py-1 bg-gray-700 text-white rounded"
          />
        </div>
        
        <button
          onClick={handleApplyFilter}
          className={`${btnClass} px-3 py-1 rounded text-sm font-bold mt-4`}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default YearFilter;