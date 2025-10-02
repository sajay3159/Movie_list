import React, { useRef, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const retryTimeoutRef = useRef(null);

  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.info/api/fil");
      const data = await response.json();

      const transformedMovie = data.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovie);
    } catch (error) {
      setError("Something went wrong ....Retrying" || error.message);
      retryTimeoutRef.current = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);
    }
    setIsLoading(false);
  };

  const cancelRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
      setError("Retry cancelled by user.");
    }
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && !error && <MoviesList movies={movies} />}
        {error && <button onClick={cancelRetry}>Cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;
