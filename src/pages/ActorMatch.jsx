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
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="actor-match-page">
      <Navbar user={props.user} onLogout={props.onLogout} />
      <div className="actor-match-container" style={{ paddingTop: "100px" }}>
        <h1 className="title-text">Which actor are you?</h1>
        <p className="subtitle">Upload a photo and our AI will find your lookalike!</p>
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
                {loading ? "Analyzing..." : "Find my lookalike!"}
              </button>
            </div>
          )}
        </form>
        
        
        
        
        {result && (
          <div className="result-section fade-in">
            <h2>You look like: <span style={{color: "#40d6ff"}}>{result.name}</span></h2>
            <p>Lookalike percentage: {result.confidence}%</p>
            {result.image ? (
              <img src={result.image} alt={result.name} className="result-img" />
            ) : (
              <p>No actor's photo was found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}