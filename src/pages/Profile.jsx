import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../ui/components/Navbar/Navbar";
import SearchedMoviesView from "../ui/components/SearchedMoviesView";
import Button from "../ui/Button";
import "./Profile.css";

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    username: "MovieFan",
    email: "user@moviesquiz.com",
    avatar: "https://media.themoviedb.org/t/p/w200/kBf3g9crrADGMcNcTRVEqWksKtY.jpg"
  });

  const [tempUser, setTempUser] = useState(user);

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleEditClick = () => {
    setTempUser(user); 
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false); 
  };

  const handleSave = () => {
    setUser(tempUser); 
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Navbar />
      
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  className="profile-input"
                  value={tempUser.username} 
                  onChange={handleChange} 
                />
                
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="profile-input"
                  value={tempUser.email} 
                  onChange={handleChange} 
                />

                <div className="edit-actions">
                  <Button onClick={handleSave} styleType="primary">Αποθήκευση</Button>
                  <Button onClick={handleCancel} styleType="secondary">Ακύρωση</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{user.username}</h1>
                <p className="profile-email">{user.email}</p>
                <div style={{ marginBottom: '1rem' }}>
                    <Button onClick={handleEditClick} styleType="secondary" size="small">
                        Επεξεργασία Προφίλ
                    </Button>
                </div>
              </>
            )}
            
            <div className="profile-stats">
              <span><strong>{favorites.length}</strong> Αγαπημένες Ταινίες</span>
            </div>
            
            {!isEditing && (
              <div style={{ marginTop: '1.5rem' }}>
                  <Button onClick={handleLogout} styleType="danger">Αποσύνδεση</Button>
              </div>
            )}
          </div>
        </div>

        <hr className="profile-divider" />

        <div className="favorites-section">
          <h2 className="section-title">Οι Αγαπημένες μου Ταινίες</h2>
          {favorites.length > 0 ? (
            <SearchedMoviesView movies={favorites} />
          ) : (
            <div className="empty-state">
              <p>Δεν έχεις προσθέσει ακόμα ταινίες στα αγαπημένα.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;