import classes from "./Movie.module.css";

const Movie = (props) => {
  const deleteMovieHandler = () => {
    props.onDeleteMovie(props.id);
  };

  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={deleteMovieHandler} style={{ backgroundColor: "red" }}>
        Delete
      </button>
    </li>
  );
};

export default Movie;
