import { useRef } from "react";
import classes from "./AddMovie.module.css";

const AddMovie = (props) => {
  const titleRef = useRef();
  const openingTextRef = useRef();
  const dateRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const movie = {
      title: titleRef.current.value,
      openingText: openingTextRef.current.value,
      date: dateRef.current.value,
    };

    props.onAddMovie(movie);
    titleRef.current.value = "";
    openingTextRef.current.value = "";
    dateRef.current.value = "";
  };
  return (
    <form onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" ref={titleRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="opening-text">Opening Text</label>
        <textarea rows="5" id="opening-text" ref={openingTextRef}></textarea>
      </div>
      <div className={classes.control}>
        <label htmlFor="date">Release Date</label>
        <input type="text" id="date" ref={dateRef} />
      </div>
      <button className={classes.button}>Add Movie</button>
    </form>
  );
};

export default AddMovie;
