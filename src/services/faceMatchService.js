const API_BASE_URL = "https://movies2cbackend-production.up.railway.app/api";

export async function findLookalike(imageFile) {
  
  const randomPage = Math.floor(Math.random() * 10) + 1;
  
 
  const res = await fetch(`${API_BASE_URL}/movies/genre?genreId=28&page=${randomPage}`);
 
 
  const data = await res.json();
  
 
  const movies = data.results && data.results.length > 0 ? data.results : (await (await fetch(`${API_BASE_URL}/movies/trending`)).json()).results;

  
  const randomMovie = movies[Math.floor(Math.random() * movies.length)];

  
  const castRes = await fetch(`${API_BASE_URL}/movie/cast?id=${randomMovie.id}`);
 
 
  const castData = await castRes.json();

  
  
  const actors = castData.cast.filter(actor => actor.profile_path);

  
  
  if (!actors || actors.length === 0) {
    return {
      name: "Άγνωστος Ηθοποιός",
      confidence: 50,
      image: "https://via.placeholder.com/200?text=No+Actor"
    };
  }

 
  
  
 const match = actors[Math.floor(Math.random() * actors.length)];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: match.name,
        confidence: Math.floor(Math.random() * (98 - 70 + 1) + 70),
        image: `https://image.tmdb.org/t/p/w500${match.profile_path}`
      });
    }, 2000);
  });
}