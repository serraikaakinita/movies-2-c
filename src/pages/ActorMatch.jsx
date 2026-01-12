import { useState } from "react";
import Navbar from "../ui/components/Navbar/Navbar";
import { findLookalike } from "../services/faceMatchService";
import "./ActorMatch.css";
import "../ui/Button.css"; 

export default function ActorMatch(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); 
    }
  };
  const handleFindMatch = async (e) => {
    e.preventDefault();

    if (!selectedImage) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await findLookalike(selectedImage);
      setResult(data);
    } catch (error) {
      console.error("Σφάλμα:", error);
      alert("Κάτι πήγε στραβά με την αναζήτηση.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actor-match-page">
      <Navbar user={props.user} onLogout={props.onLogout} />
      <div className="actor-match-container" style={{ paddingTop: "100px" }}>
        <h1 className="title-text">Ποιος ηθοποιός είσαι;</h1>
        <p className="subtitle">Ανέβασε μια φωτογραφία σου και το AI θα βρει τον διάσημο σωσία σου!</p>
        <form className="upload-section" onSubmit={handleFindMatch}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="file-input"
          />
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Upload preview" className="preview-img" />
            </div>
          )}
          {selectedImage && (
            <div style={{ marginTop: "20px" }}>
              <button 
                className="login-btn" 
                type="submit" 
                disabled={loading}
                style={{ fontSize: "16px", padding: "10px 20px", cursor: "pointer" }}
              >
                {loading ? "Ανάλυση..." : "Βρες τον σωσία μου!"}
              </button>
            </div>
          )}
        </form>
        {result && (
          <div className="result-section fade-in">
            <h2>Μοιάζεις με: <span style={{color: "#40d6ff"}}>{result.name}</span></h2>
            <p>Ποσοστό ομοιότητας: {result.confidence}%</p>
            {result.image ? (
              <img src={result.image} alt={result.name} className="result-img" />
            ) : (
              <p>Δεν βρέθηκε φωτογραφία του ηθοποιού.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}