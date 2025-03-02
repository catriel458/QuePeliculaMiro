const Header = ({ darkMode }) => {
  return (
    <header
      className={`p-5 text-center text-3xl font-bold ${
        darkMode ? "bg-cineDorado text-cineRojo" : "bg-cineRojo text-cineDorado"
      }`}
    >
      🍿 ¿Qué Película Miro? 🎥
    </header>
  );
};

export default Header;
