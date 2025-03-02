import { useState } from "react";
import Home from "./pages/Home";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-gray-900 text-white"}>
      {/* Botón para cambiar el modo */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 bg-cineDorado text-cineRojo px-3 py-1 rounded-lg"
      >
        {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
      </button>

      {/* Pasamos la prop darkMode a Home */}
      <Home darkMode={darkMode} />
    </div>
  );
}

export default App;
