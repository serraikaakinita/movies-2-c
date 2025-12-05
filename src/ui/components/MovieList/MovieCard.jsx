import React from "react";
import './MovieCard.css'

function MovieCard (props) {
    return(
        <a href="" className='movie_card'>
            <img src={"https://media.themoviedb.org/t/p/w220_and_h330_face/"+props.moviePoster} alt="" 
            className="movie_poster"
            />
            <div className="movie_details"> 
                <h3 className="movie_details_heading">{props.movieName}</h3>
                <div className="align_center movie_date_rate">
                    <p>{props.movieDate}</p>
                    <p>{"⭐" + props.movieRating}</p>
                </div>
                <p className="movie_description">
                    {props.movieDescription}
                </p>
            </div>
        </a>
    )
};

export default MovieCard;