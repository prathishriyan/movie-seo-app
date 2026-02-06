import Head from "next/head";
import axios from "axios";
import Link from "next/link";

export async function getServerSideProps({ params }) {
  try {
    const slug = params.slug.replace(/-/g, " ");

    // 1️⃣ Search movie
    const searchRes = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        slug
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const movie = searchRes.data.results[0];
    if (!movie) return { notFound: true };

    // 2️⃣ Similar movies
    const similarRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie.id}/similar`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        },
      }
    );

    // 3️⃣ Cast & crew
    const creditsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        },
      }
    );

    return {
      props: {
        movie,
        similarMovies: similarRes.data.results.slice(0, 10),
        cast: creditsRes.data.cast.slice(0, 8),
        crew: creditsRes.data.crew,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MoviePage({ movie, similarMovies, cast, crew }) {
  const director = crew.find((c) => c.job === "Director");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    datePublished: movie.release_date,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count || 1000,
    },
  };

  return (
    <>
      <Head>
        <title>{movie.title} | MovieFlix</title>
        <meta name="description" content={movie.overview} />

        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview} />
        <meta property="og:type" content="movie" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>

      <main className="bg-black text-white min-h-screen">
        {/* 🎬 HERO SECTION */}
        <section
          className="relative h-[70vh] bg-cover bg-center flex items-end"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 flex gap-8">
            {/* Poster */}
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="w-[220px] rounded-lg shadow-xl"
                alt={movie.title}
              />
            )}

            {/* Info */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold mb-4">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                <span className="text-yellow-400 font-semibold">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
                <span>📅 {movie.release_date || "N/A"}</span>
                <span className="uppercase">
                  🌐 {movie.original_language}
                </span>
              </div>

              {director && (
                <p className="text-sm text-gray-300 mb-2">
                  Director: {director.name}
                </p>
              )}

              <p className="text-gray-300 leading-relaxed">
                {movie.overview}
              </p>

              {/* Back Button */}
              <div className="mt-6">
                <Link href="/" className="inline-block">
                  <span className="bg-amber-800 hover:bg-amber-500 active:bg-amber-600 transition px-6 py-2 rounded font-semibold cursor-pointer inline-block">
                    ← Back to Home
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CAST */}
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Cast
          </h2>

          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="min-w-[140px] bg-zinc-900 rounded-lg p-3 text-center hover:bg-zinc-800 active:bg-zinc-700 transition cursor-pointer"
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    className="rounded mb-2"
                    alt={actor.name}
                  />
                ) : (
                  <div className="h-[185px] bg-zinc-700 rounded mb-2" />
                )}

                <p className="text-sm font-semibold">
                  {actor.name}
                </p>
                <p className="text-xs text-gray-400">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/*SIMILAR MOVIES */}
        <section className="max-w-6xl mx-auto px-6 mt-12 pb-12">
          <h2 className="text-xl font-semibold mb-4">
            Similar Movies
          </h2>

          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {similarMovies.map((m) => (
              <Link
                key={m.id}
                href={`/movies/${slugify(m.title)}`}
              >
                <div className="min-w-[160px] bg-zinc-900 rounded-lg overflow-hidden border border-transparent hover:border-red-600 hover:scale-110 active:scale-95 transition cursor-pointer">
                  {m.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                      alt={m.title}
                    />
                  )}
                  <div className="p-2">
                    <p className="text-sm truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      ⭐ {m.vote_average}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
