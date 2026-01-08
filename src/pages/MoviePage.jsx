import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./MoviePage.css";
import Row from "../ui/Row";
import Navbar from "../ui/components/Navbar/Navbar";
import Trailer from "../ui/components/Trailer/Trailer";
import Button from "../ui/Button";

function MoviePage(props) {
  const [movie, setMovie] = useState({});
  const [members, setMembers] = useState({});
  const params = useParams();
  //const id = params.id.slice(1);
  const rawId = params.id;
  const id = rawId?.startsWith(":") ? rawId.slice(1) : rawId;
  //
  const [selectedTab, setSelectedTab] = useState("details");
  const [query, setQuery] = useState("");

  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/movie?id=${id}`
        );
        const data = await res.json();
        setMovie(data);
      }
      getMovieDetails();
    },
    [id]
  );

  useEffect(
    function () {
      async function getCastDetails() {
        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/movie/cast?id=${id}`
        );
        const data = await res.json();
        console.log(data);
        setMembers(data);
      }
      getCastDetails();
    },
    [id]
  );

  useEffect(() => {
    async function getTrailer() {
      try {
        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/movie/trailer?id=${id}`
        );
        const data = await res.json();

        console.log("TMDB id:", id);
        console.log("TMDB videos results:", data.results);

        const results = data.results || [];

        const picked =
          results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          results.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
          results.find((v) => v.site === "YouTube");

        console.log("Picked video:", picked);
        console.log("Picked key:", picked?.key);

        setTrailerKey(picked?.key || null);
      } catch (e) {
        console.log("Trailer fetch error:", e);
        setTrailerKey(null);
      }
    }

    if (!id) return;
    getTrailer();
  }, [id]);

  return (
    <div>
      <Navbar
        user={props.user}
        onLogout={props.onLogout}
        query={query}
        setQuery={setQuery}
      />
      {isTrailerOpen && (
        <Trailer
          youtubeKey={trailerKey}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
      <Row type="horizontal" margin="1rem" gap="1rem" content="center">
        <img
          src={
            "https://media.themoviedb.org/t/p/w600_and_h900_face/" +
            movie.poster_path
          }
          alt=""
          className="movie_display_image"
        />
        <Row type="vertical">
          <Row type="horizontal">
            <h1>{movie.title}</h1>
            <Row type="vertical" gap="1rem">
              <p>{"⭐" + movie.vote_average}</p>
            </Row>
          </Row>
          <div className="movie_box_container">
            <Row type="horizontal">
              <Row type="horizontal">
                <div
                  className={`tab ${
                    selectedTab === "details" ? "active_tab" : ""
                  }`}
                  style={{ borderRadius: "7px 0 0 0" }}
                  onClick={() => setSelectedTab("details")}
                >
                  details
                </div>
                {/* /////////////////////////////// */}
                <div
                  className={`tab ${
                    selectedTab === "cast" ? "active_tab" : ""
                  }`}
                  style={{ borderRadius: "7px 0 0 0" }}
                  onClick={() => setSelectedTab("cast")}
                >
                  cast
                </div>
                <div
                  className={`tab ${
                    selectedTab === "comments" ? "active_tab" : ""
                  }`}
                  style={{ borderRadius: "0px 0 0 0" }}
                  onClick={() => setSelectedTab("comments")}
                >
                  comments
                </div>
              </Row>
            </Row>
            {selectedTab === "details" ? (
              <MovieDetailsView
                movie={movie}
                trailerKey={trailerKey}
                onOpenTrailer={() => setIsTrailerOpen(true)}
              />
            ) : selectedTab === "comments" ? (
              <UserComments />
            ) : (
              <MovieCastView members={members} />
            )}
          </div>
        </Row>
      </Row>
    </div>
  );
}
export default MoviePage;

function MovieDetailsView({ movie, trailerKey, onOpenTrailer }) {
  return (
    <Row type="vertical" content="center" gap="2rem" margin="1rem">
      <Row type="horizontal" gap="1rem">
        <h4>{movie.release_date}</h4>
        <h4>{movie.runtime}min</h4>
      </Row>
      <p>{movie.overview}</p>
      <Row type="horizonal" gap="0.5rem">
        <div>genres:</div>
        {movie.genres?.map((genre, i) => (
          <div key={genre.name}>
            {genre.name}
            {movie.genres.length == i + 1 ? " " : ","}
          </div>
        ))}
      </Row>

      <Button disabled={!trailerKey} onClick={onOpenTrailer}>
        ▶ Trailer
      </Button>

      {!trailerKey && <p>No trailer available.</p>}
    </Row>
  );
}

function UserComments() {
  return <div>test</div>;
}

function MovieCastView({ members }) {
  return (
    <Row type="vertical" content="center" gap="1rem" margin="1rem">
      <Row type="horizontal" gap="1rem">
        <h1>Actors</h1>
      </Row>
      <Row type="horizontal" gap="2rem" margin="0.1rem">
        {members.cast?.slice(0, 5).map((cast) => (
          <div key={cast.id} className="actor_container">
            <img
              className="actor_image"
              src={
                cast.profile_path
                  ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
                  : "/no-avatar.png"
              }
              alt={cast.name}
            />
            <h4>{cast.name}</h4>
          </div>
        ))}
      </Row>
      <Row type="horizontal" gap="2rem" margin="0.1rem">
        <h1>Directors</h1>
      </Row>
      <Row type="horizontal" gap="1rem" margin="0.1rem">
        {members.crew?.slice(0, 3).map((crew, i) => (
          <div key={crew.name}>
            {crew.name}
            {members.crew.length == i + 1 ? " " : ","}
          </div>
        ))}
      </Row>
    </Row>
  );
}
