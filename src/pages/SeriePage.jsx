import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import "./MoviePage.css";
import Row from "../ui/Row";
import Navbar from "../ui/components/Navbar/Navbar";

const TMDB_API_KEY = "d812c9240d5a77043826e7d1b7e36a19";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://media.themoviedb.org/t/p/w600_and_h900_face/";

function SeriePage(props) {
  const params = useParams();
  const rawId = params.id;
  const id = rawId?.startsWith(":") ? rawId.slice(1) : rawId;

  const [series, setSeries] = useState(null);
  const [selectedTab, setSelectedTab] = useState("details");
  const [query, setQuery] = useState("");

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [seasonError, setSeasonError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function getSeriesDetails() {
      try {
        const res = await fetch(
          `${TMDB_BASE}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        setSeries(data);

        const firstSeasonNumber =
          data?.seasons?.find((s) => (s?.season_number ?? 0) > 0)
            ?.season_number ?? 1;
        setSelectedSeason(firstSeasonNumber);
      } catch (e) {
        console.error(e);
        if (!cancelled) setSeries(null);
      }
    }

    getSeriesDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const seasons = useMemo(() => {
    return (series?.seasons ?? []).filter((s) => (s?.season_number ?? 0) > 0);
  }, [series]);

  useEffect(() => {
    if (!id) return;
    if (selectedTab !== "episodes") return;
    if (!selectedSeason && selectedSeason !== 0) return;

    let cancelled = false;

    async function getSeasonEpisodes() {
      setLoadingSeason(true);
      setSeasonError("");

      try {
        const res = await fetch(
          `${TMDB_BASE}/tv/${id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        setSeasonData(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setSeasonData(null);
          setSeasonError("error");
        }
      } finally {
        if (!cancelled) setLoadingSeason(false);
      }
    }

    getSeasonEpisodes();
    return () => {
      cancelled = true;
    };
  }, [id, selectedSeason, selectedTab]);

  return (
    <div>
      <Navbar
        user={props.user}
        onLogout={props.onLogout}
        query={query}
        setQuery={setQuery}
      />

      <Row type="horizontal" margin="1rem" gap="1rem" content="center">
        <img
          src={series?.poster_path ? TMDB_IMG + series.poster_path : ""}
          alt=""
          className="movie_display_image"
        />

        <Row type="vertical">
          <Row type="horizontal">
            <h1>{series?.name}</h1>
            <Row type="vertical" gap="1rem">
              <p>{"⭐" + (series?.vote_average ?? "")}</p>
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

                <div
                  className={`tab ${
                    selectedTab === "episodes" ? "active_tab" : ""
                  }`}
                  style={{ borderRadius: "0px 0 0 0" }}
                  onClick={() => setSelectedTab("episodes")}
                >
                  episodes
                </div>
              </Row>
            </Row>
            <div className="movie_box_content">
              {selectedTab === "details" ? (
                <SeriesDetailsView series={series} />
              ) : (
                <EpisodesTab
                  seasons={seasons}
                  selectedSeason={selectedSeason}
                  setSelectedSeason={setSelectedSeason}
                  seasonData={seasonData}
                  loadingSeason={loadingSeason}
                  seasonError={seasonError}
                />
              )}
            </div>
          </div>
        </Row>
      </Row>
    </div>
  );
}

export default SeriePage;

function SeriesDetailsView({ series }) {
  const runtime =
    Array.isArray(series?.episode_run_time) &&
    series.episode_run_time.length > 0
      ? series.episode_run_time[0]
      : null;

  return (
    <Row type="vertical" content="center" gap="2rem" margin="1rem">
      <Row type="horizontal" gap="1rem">
        <h4>{series?.first_air_date}</h4>
        {runtime ? <h4>{runtime}min</h4> : null}
      </Row>

      <p>{series?.overview}</p>

      <Row type="horizontal" gap="0.5rem">
        <div>genres:</div>
        {series?.genres?.map((genre, i) => (
          <div key={genre.id ?? genre.name}>
            {genre.name}
            {series.genres.length === i + 1 ? " " : ","}
          </div>
        ))}
      </Row>
    </Row>
  );
}

function EpisodesTab({
  seasons,
  selectedSeason,
  setSelectedSeason,
  seasonData,
  loadingSeason,
  seasonError,
}) {
  return (
    <Row type="vertical" gap="1rem" margin="1rem">
      <Row type="horizontal" gap="1rem" content="center">
        <div style={{ fontWeight: 600 }}>Season:</div>

        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
        >
          {seasons.map((s) => (
            <option key={s.id ?? s.season_number} value={s.season_number}>
              {s.name || `Season ${s.season_number}`}
            </option>
          ))}
        </select>
      </Row>

      {loadingSeason ? <div>Loading episodes...</div> : null}
      {seasonError ? <div>{seasonError}</div> : null}

      {!loadingSeason && !seasonError ? (
        <Row type="vertical" gap="0.75rem">
          {(seasonData?.episodes ?? []).map((ep) => (
            <div
              key={ep.id ?? ep.episode_number}
              style={{
                padding: "0.75rem",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                E{ep.episode_number}: {ep.name}
              </div>
              <div style={{ opacity: 0.85, marginTop: "0.25rem" }}>
                {ep.air_date ? `Air: ${ep.air_date}` : ""}
                {ep.runtime ? ` • ${ep.runtime}min` : ""}
              </div>
              {ep.overview ? (
                <div style={{ marginTop: "0.5rem", opacity: 0.9 }}>
                  {ep.overview}
                </div>
              ) : null}
            </div>
          ))}
        </Row>
      ) : null}
    </Row>
  );
}
