import { useEffect, useState } from "react";
import { FaSackDollar, FaTrophy, FaBolt } from "react-icons/fa6";
import "./MovieStats.css";

export default function MovieStats({ boxOffice, awardPotential, starPower }) {
  const [show, setShow] = useState(false);
  const [counts, setCounts] = useState({ box: 0, award: 0, star: 0 });

  useEffect(() => {
    setShow(true);
    const animate = (key, target) => {
      let start = 0;
      const step = target / 50; 
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setCounts(p => ({ ...p, [key]: Math.floor(start) }));
      }, 20);
    };
    
    animate('box', boxOffice);
    animate('award', awardPotential);
    animate('star', starPower);
  }, [boxOffice, awardPotential, starPower]);

  return (
    <div className={`stats-grid ${show ? "visible" : ""}`}>
      <div className="stat-card card-box">
        <div className="card-header"><FaSackDollar className="icon box-c"/> <span>BOX OFFICE PROXY</span></div>
        <div className="score">{counts.box}</div>
        <div className="bar-bg"><div className="bar-fill box-bg" style={{width: `${boxOffice}%`}}></div></div>
      </div>
      
      <div className="stat-card card-award">
        <div className="card-header"><FaTrophy className="icon award-c"/> <span>AWARD POTENTIAL</span></div>
        <div className="score">{counts.award}</div>
        <div className="bar-bg"><div className="bar-fill award-bg" style={{width: `${awardPotential}%`}}></div></div>
      </div>

      <div className="stat-card card-star">
        <div className="card-header"><FaBolt className="icon star-c"/> <span>STAR POWER</span></div>
        <div className="score">{counts.star}</div>
        <div className="bar-bg"><div className="bar-fill star-bg" style={{width: `${starPower}%`}}></div></div>
      </div>
    </div>
  );
}