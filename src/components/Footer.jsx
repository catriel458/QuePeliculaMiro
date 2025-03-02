const Footer = ({ darkMode }) => {
    const footerBgClass = darkMode 
      ? "bg-gray-800 border-t border-blue-400" 
      : "bg-gray-900 border-t border-cineDorado";
    
    const linkClass = darkMode
      ? "text-blue-400 hover:text-blue-300"
      : "text-cineDorado hover:text-yellow-300";
  
    return (
      <footer className={`${footerBgClass} py-4 mt-8 text-center text-white`}>
        <div className="container mx-auto px-4">
          <p className="mb-2">
            🎬 Realizado por Catriel 👨‍💻
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="mailto:catrielcabrera97@gmail.com" 
              className={`${linkClass} transition-colors`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              ✉️ catrielcabrera97@gmail.com
            </a>
            <a 
              href="https://github.com/catriel458" 
              className={`${linkClass} transition-colors`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              🐙 GitHub
            </a>
          </div>
          <p className="mt-4 text-sm opacity-75">
            🍿 Utilizando la API de The Movie Database 🎥
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;