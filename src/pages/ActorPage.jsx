import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import "./ActorPage.css";
import Row from "../ui/Row";
import Navbar from "../ui/components/Navbar/Navbar";

const TMDB_API_KEY = "d812c9240d5a77043826e7d1b7e36a19";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

function ActorPage(props) {
  const params = useParams();
  const rawId = params.id;
  const id = rawId?.startsWith(":") ? rawId.slice(1) : rawId;

  const [query, setQuery] = useState("");
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    if (!id) return;

    async function fetchPerson() {
      setStatus({ loading: true, error: "" });

      try {
        const [personRes, creditsRes] = await Promise.all([
          fetch(
            `${TMDB_BASE}/person/${id}?api_key=${TMDB_API_KEY}&language=en-US`
          ),
          fetch(
            `${TMDB_BASE}/person/${id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`
          ),
        ]);

        if (!personRes.ok) {
          throw new Error(`TMDB person error: ${personRes.status}`);
        }
        if (!creditsRes.ok) {
          throw new Error(`TMDB credits error: ${creditsRes.status}`);
        }

        const personData = await personRes.json();
        const creditsData = await creditsRes.json();

        setPerson(personData);
        setCredits(creditsData);
        setStatus({ loading: false, error: "" });
      } catch (e) {
        setStatus({
          loading: false,
          error: "ERROR LOADING.",
        });
        setPerson(null);
        setCredits(null);
        console.log(e);
      }
    }

    fetchPerson();
  }, [id]);

  const knownFor = useMemo(() => {
    const cast = credits?.cast || [];

    return cast
      .filter((x) => x.poster_path)
      .sort((a, b) => {
        const aScore = (a.vote_count || 0) * (a.vote_average || 0);
        const bScore = (b.vote_count || 0) * (b.vote_average || 0);
        return bScore - aScore;
      })
      .slice(0, 12);
  }, [credits]);

  return (
    <div>
      <Navbar
        user={props.user}
        onLogout={props.onLogout}
        query={query}
        setQuery={setQuery}
      />

      <Row type="horizontal" margin="1rem" gap="1.5rem" content="center">
        {status.loading ? (
          <div className="actor_loading"></div>
        ) : status.error ? (
          <div className="actor_error">{status.error}</div>
        ) : (
          <>
            <img
              src={
                person?.profile_path
                  ? `${TMDB_IMG}/w600_and_h900_face${person.profile_path}`
                  : "/no-avatar.png"
              }
              alt={person?.name || "Actor"}
              className="actor_display_image"
            />

            <Row type="vertical" gap="1rem">
              <Row type="vertical" gap="0.25rem">
                <h1 className="actor_name">{person?.name}</h1>
                {person?.known_for_department && (
                  <div className="actor_subtitle">
                    {person.known_for_department}
                  </div>
                )}
              </Row>

              <Row type="vertical" gap="0.35rem" className="actor_meta">
                {person?.birthday && (
                  <div>
                    <b>Birthday:</b> {person.birthday}
                  </div>
                )}
                {person?.place_of_birth && (
                  <div>
                    <b>Place of birth:</b> {person.place_of_birth}
                  </div>
                )}
                {typeof person?.popularity === "number" && (
                  <div>
                    <b>Popularity:</b> {person.popularity.toFixed(1)}
                  </div>
                )}
              </Row>

              <div className="actor_bio_box">
                <h3>Bio</h3>
                <p className="actor_bio">
                  {person?.biography?.trim() ? person.biography : "No bio"}
                </p>
              </div>

              <div className="knownfor_box">
                <Row type="horizontal" content="space-between" gap="1rem">
                  <h3>Known for</h3>
                  <div className="knownfor_hint">(movies/series)</div>
                </Row>

                <div className="knownfor_grid">
                  {knownFor.map((item) => {
                    const title = item.title || item.name || "Untitled";
                    const poster = `${TMDB_IMG}/w185${item.poster_path}`;

                    const linkTo =
                      item.media_type === "movie"
                        ? `/movie/${item.id}`
                        : item.media_type === "tv"
                        ? `/tv/${item.id}`
                        : "#";

                    return (
                      <Link
                        key={`${item.media_type}-${item.id}`}
                        to={linkTo}
                        className="knownfor_card"
                        title={title}
                      >
                        <img
                          className="knownfor_poster"
                          src={poster}
                          alt={title}
                        />
                        <div className="knownfor_title">{title}</div>
                      </Link>
                    );
                  })}

                  {knownFor.length === 0 && (
                    <div className="knownfor_empty">Not Found</div>
                  )}
                </div>
              </div>
            </Row>
          </>
        )}
      </Row>
    </div>
  );
}

export default ActorPage;
