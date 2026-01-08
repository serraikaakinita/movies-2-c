import "./Trailer.css";

function Trailer({ youtubeKey, onClose }) {
  if (!youtubeKey) return null;

  return (
    <div className="trailer-overlay">
      <button className="trailer-close" onClick={onClose} type="button">
        ✖
      </button>

      <iframe
        className="trailer-iframe"
        src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default Trailer;
