import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedWorks from "@/components/FeaturedWorks";
import AboutMe from "@/components/AboutMe";
import Gallery from "@/components/Gallery";
import Certificates from "@/components/Certificates";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="relative bg-white dark:bg-slate-950 transition-colors duration-500">

        {/* Global Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.8] z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.04)_1px,transparent_1px)]"
          style={{ backgroundSize: '32px 32px' }}
        />

        {/* --- START EDGE FADE EFFECT --- */}
        {/* Hapus blok ini jika Anda tidak menyukai efek bayangan putih yang diam di atas dan bawah layar saat di-scroll */}
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between">
          <div className="sticky top-0 w-full h-0 bg-gradient-to-b from-white dark:from-slate-950 to-transparent" />
          <div className="sticky bottom-0 w-full h-[50vh] bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        </div>
        {/* --- END EDGE FADE EFFECT --- */}

        <div className="relative z-10">
          <FeaturedWorks />
          <AboutMe />
          <Gallery />
          <Certificates />
        </div>
      </div>
      <Footer />
    </main>
  );
}
