import Head from "next/head";
import axios from "axios";

export async function getServerSideProps({ params }) {
  const slug = params.slug.replace(/-/g, " ");

  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      slug
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const movie = response.data.results[0];

  if (!movie) {
    return { notFound: true };
  }

  return {
    props: { movie },
  };
}

export default function MoviePage({ movie }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    datePublished: movie.release_date,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average,
      ratingCount: 1000,
    },
  };

  return (
    <>
      <Head>
        <title>{movie.title} | Movie Details</title>
        <meta
          name="description"
          content={movie.overview}
        />

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

      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {movie.title}
        </h1>

        <p className="text-gray-600 mb-2">
          ⭐ Rating: {movie.vote_average}
        </p>

        <p className="text-gray-700">
          {movie.overview}
        </p>
      </main>
    </>
  );
}
