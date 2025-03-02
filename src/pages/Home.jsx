import Header from "../components/Header";
import MovieList from "../components/MovieList";
import Footer from "../components/Footer";

const Home = ({ darkMode }) => {
  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-900 text-white"}`}>
      <Header darkMode={darkMode} />
      <MovieList darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home;