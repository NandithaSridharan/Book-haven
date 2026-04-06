import { Link } from "react-router-dom";

export default function Home() {
  const trending = [
    { title: "Binding 13", cover: "/images/binding13.jpg" },
    { title: "The Psychology of Money", cover: "/images/tpom.jpg" },
    { title: "Funny Story", cover: "/images/funnystory.jpg" },
    { title: "The good girls murder", cover: "/images/ggm.jpg" },
    { title: "Happy Place", cover: "/images/happyplace.jpg" },
    { title: "The Secret of secrets", cover: "/images/danbrown.jpg" },
     { title: "Pride and Predjudice", cover: "/images/prideandprejudice.jpg" },
     {title: "Ego is the Enemty", cover: "/images/samplebook.jpg" }, 
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <img
          src="/images/hero.png"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-3">
            Book Haven 📚
          </h1>

          <p className="text-xl mb-6">
            Your cozy corner to discover magical books
          </p>

          <Link
            to="/books"
            className="bg-[#6B4F3A] px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            Explore Books
          </Link>
        </div>
      </section>


      {/* TRENDING BOOKS */}
      <section className="p-10 max-w-6xl mx-auto">

        <h2 className="text-3xl mb-8 font-bold">
          🔥 Trending This Month
        </h2>


        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trending.map((book, index) => (
            <div
              key={index}
              className="bg-[#FFF8F0] rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-[2/3] bg-white flex items-center justify-center overflow-hidden">
              

              <img src={book.cover} alt={book.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 hover: shadow-lg" />
              </div>
              {/* Title */}
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">
                  {book.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* WHY BOOK HAVEN */}
      <section className="p-10 bg-[#FFF8F0]">
        <h2 className="text-3xl mb-6 font-bold text-center">
          Why Book Haven?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-xl font-semibold">📚 Discover Books</h3>
            <p>Find curated books you'll love.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">⭐ Track Reading</h3>
            <p>Wishlist, history, and progress.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">💬 Join Community</h3>
            <p>Discuss books with readers.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#6B4F3A] text-white p-6 text-center">
        <p>
          "A reader lives a thousand lives before he dies."
        </p>
        <p className="text-sm mt-2">
          Book Haven © 2026
        </p>
      </footer>

    </div>
  );
}
