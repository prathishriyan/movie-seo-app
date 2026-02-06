import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const GENRES = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
  Thriller: 53,
  Animation: 16,
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getServerSideProps() {
  const response = await axios.get(
    "https://api.themoviedb.org/3/movie/popular",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );

  return {
    props: {
      movies: response.data.results.slice(0, 30),
    },
  };
}

export default function Home({ movies }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  //  Search
  let filtered = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // ↕ Sort
  filtered = filtered.sort((a, b) => {
    if (sortBy === "rating-desc") return b.vote_average - a.vote_average;
    if (sortBy === "rating-asc") return a.vote_average - b.vote_average;
    if (sortBy === "date-desc")
      return new Date(b.release_date) - new Date(a.release_date);
    if (sortBy === "date-asc")
      return new Date(a.release_date) - new Date(b.release_date);
    return 0;
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 pb-10">
      {/* Navbar */}
      <header className="sticky top-0 z-50
                          bg-black/80 backdrop-blur
                          border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h1 className=" text-3xl font-extrabold tracking-wide
                        bg-gradient-to-r from-amber-300 to-orange-400
                        text-transparent bg-clip-text">
          MovieVerse
        </h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 px-4 py-2 rounded focus:outline-none"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 px-4 py-2 rounded"
          >
            <option value="rating-desc">Rating ↓</option>
            <option value="rating-asc">Rating ↑</option>
            <option value="date-desc">Release Date ↓</option>
            <option value="date-asc">Release Date ↑</option>
          </select>
          </div>
        </div>
      </header>

      {/*  HORIZONTAL GENRE ROWS */}
      {Object.entries(GENRES).map(([genreName, genreId]) => {
        const genreMovies = filtered.filter((movie) =>
          movie.genre_ids.includes(genreId)
        );

        if (genreMovies.length === 0) return null;

        return (
          <section key={genreName} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {genreName}
            </h2>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {genreMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${slugify(movie.title)}`}
                >
                  <div className="min-w-[180px] bg-zinc-900 rounded-lg overflow-hidden hover:scale-110 transition cursor-pointer">
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="h-[270px] w-full object-cover"
                        alt={movie.title}
                      />
                    )}
                    <div className="p-2">
                      <p className="text-sm truncate">
                        {movie.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        ⭐ {movie.vote_average}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/*  VERTICAL GRID (Browse All) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Browse All Movies
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${slugify(movie.title)}`}
            >
              <div className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="h-[250px] w-full object-cover"
                    alt={movie.title}
                  />
                )}
                <div className="p-2">
                  <p className="text-sm truncate">
                    {movie.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    ⭐ {movie.vote_average}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
