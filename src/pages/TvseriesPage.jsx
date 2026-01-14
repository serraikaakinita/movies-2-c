import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Row from "../ui/Row";
import "./Homepage.css";

import TvserieList from "../ui/components/TvserieList/TvserieList";
import SearchedMoviesView from "../ui/components/SearchedMoviesView";
import Navbar from "../ui/components/Navbar/Navbar";
import SearchBar from "../ui/components/SearchBar/SearchBar";
import Button from "../ui/Button";
import SearchedSeriesView from "../ui/components/SearchedSeriesView";

function TvseriesPage(props) {
  const [query, setQuery] = useState("");
  const [tvseries, setTvseries] = useState([]);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchTvseries() {
        try {
          setError("");

          const res = await fetch(
            `https://movies2cbackend-production.up.railway.app/api/search/tv?name=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Tvserie not found");

          setTvseries(data.results);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          //setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setTvseries([]);
        setError("");
        return;
      }

      fetchTvseries();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div>
      <Row type="vertical" content="center">
        {/* <Row content="center" type="horizontal">
          <SearchBar query={query} setQuery={setQuery} />
        </Row> */}
        <Navbar
          user={props.user}
          onLogout={props.onLogout}
          query={query}
          setQuery={setQuery}
        />
        {query.length > 3 ? (
          <SearchedSeriesView series={tvseries} />
        ) : (
          <TvserieList />
        )}
      </Row>
    </div>
  );
}

export default TvseriesPage;
