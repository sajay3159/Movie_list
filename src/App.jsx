import React, { useCallback, useEffect, useRef, useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const retryTimeoutRef = useRef(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://movie-website-bb07d-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }
      const data = await response.json();

      const loadedMovies = [];
      for (let key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError("Something went wrong ....Retrying" || error.message);
      retryTimeoutRef.current = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);
    }
    setIsLoading(false);
  }, []);

  const cancelRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
      setError("Retry cancelled by user.");
    }
  };

  const AddMovieHandler = async (newMovieObj) => {
    try {
      const response = await fetch(
        "https://movie-website-bb07d-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(newMovieObj),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add movie.");
      }
      const data = await response.json();
      console.log("Movie added:", data);
    } catch (error) {
      setError("Failed to add movie. Please try again.");
      console.error(error.message);
    }
  };

  const deleteMovieHandler = async (id) => {
    try {
      const response = await fetch(
        `https://movie-website-bb07d-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete movie.");
      }

      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      console.log("Movie deleted:", id);
    } catch (error) {
      setError("Failed to delete movie. Please try again.");
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={AddMovieHandler} />
      </section>
      <section>
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && !error && (
          <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />
        )}
        {error && <button onClick={cancelRetry}>Cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;
