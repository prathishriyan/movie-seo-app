import axios from "axios";
import Link from "next/link";

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
        "Content-Type": "application/json",
      },
    }
  );

  return {
    props: {
      movies: response.data.results.slice(0, 12),
    },
  };
}

export default function Home({ movies }) {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${slugify(movie.title)}`}
          >
            <div className="border p-4 rounded shadow cursor-pointer hover:border-blue-500 transition">
              <h2 className="font-semibold text-lg">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-600">
                ⭐ {movie.vote_average}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
