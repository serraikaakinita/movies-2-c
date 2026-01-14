import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./MoviePage.css";
import Row from "../ui/Row";
import Navbar from "../ui/components/Navbar/Navbar";
import Trailer from "../ui/components/Trailer/Trailer";
import Button from "../ui/Button";

function SeriePage(props) {
  const [series, setSeries] = useState({});
  const [members, setMembers] = useState({});
  const params = useParams();
  //const id = params.id.slice(1);
  const rawId = params.id;
  const id = rawId?.startsWith(":") ? rawId.slice(1) : rawId;
  //
  const [selectedTab, setSelectedTab] = useState("details");
  const [query, setQuery] = useState("");

  useEffect(
    function () {
      async function getSeriesDetails() {
        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/tv?id=${id}`
        );
        const data = await res.json();
        setSeries(data);
      }
      getSeriesDetails();
    },
    [id]
  );

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
          src={
            "https://media.themoviedb.org/t/p/w600_and_h900_face/" +
            series.poster_path
          }
          alt=""
          className="movie_display_image"
        />
        <Row type="vertical">
          <Row type="horizontal">
            <h1>{series.title}</h1>
            <Row type="vertical" gap="1rem">
              <p>{"⭐" + series.vote_average}</p>
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
              <SeriesDetailsView series={series} />
            ) : (
              <UserComments />
            )}
          </div>
        </Row>
      </Row>
    </div>
  );
}
export default SeriePage;

function SeriesDetailsView({ series }) {
  return (
    <Row type="vertical" content="center" gap="2rem" margin="1rem">
      <Row type="horizontal" gap="1rem">
        <h4>{series.release_date}</h4>
        <h4>{series.runtime}min</h4>
      </Row>
      <p>{series.overview}</p>
      <Row type="horizonal" gap="0.5rem">
        <div>genres:</div>
        {series.genres?.map((genre, i) => (
          <div key={genre.name}>
            {genre.name}
            {series.genres.length == i + 1 ? " " : ","}
          </div>
        ))}
      </Row>
    </Row>
  );
}

function UserComments() {
  return <div>test</div>;
}
