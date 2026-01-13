// import React, { useEffect, useState } from "react";
// import axios from "./axios";

// import "./Banner.css";

// import { Link } from "react-router-dom";

// const imageUrl = "https://image.tmdb.org/t/p/original";

// function Bannertv(props) {
//   const [series, setSeries] = useState([]);
//   useEffect(() => {
//     axios.get(props.url).then((response) => {
//       let x = Math.floor(Math.random() * 20);
//       console.log(response.data.results[x]);
//       setSeries(response.data.results[x]);
//     });
//     setInterval(() => {
//       axios.get(props.url).then((response) => {
//         let x = Math.floor(Math.random() * 20);
//         console.log(response.data.results[x]);
//         setSeries(response.data.results[x]);
//       });
//     }, 5000);
//   }, []);

//   return (
//     <div className="Container">
//       <div
//         style={{
//           backgroundImage: `url(${
//             series ? imageUrl + series.backdrop_path : ""
//           })`,
//         }}
//         className="backDrop"
//       >
//         <div className="content">
//           <h1>{series ? series.title : ""}</h1>
//           <div className="banner_button">
//             <Link to="series/:id">
//               <button>Details</button>
//             </Link>
//           </div>
//           <h2>{series.overview}</h2>
//         </div>
//         <div className="Fade"></div>
//       </div>
//     </div>
//   );
// }

// export default Bannertv;
