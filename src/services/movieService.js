export async function getTrendingMovies() {
  const url = "https://movies2cbackend-production.up.railway.app/api/movies/trending";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}
