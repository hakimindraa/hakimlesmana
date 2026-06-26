import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroV3 from "@/components/HeroV2";

const FeaturedWorks = dynamic(() => import("@/components/FeaturedWorks"));
const WebDevFeatured = dynamic(() => import("@/components/WebDevFeatured"));
const AboutMe = dynamic(() => import("@/components/AboutMe"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="relative bg-white dark:bg-slate-950 transition-colors duration-500">

        {/* Global Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.8] z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.04)_1px,transparent_1px)]"
          style={{ backgroundSize: '32px 32px' }}
        />

        <div className="relative z-10">
          <HeroV3 />
        </div>


        {/* --- START EDGE FADE EFFECT --- */}
        {/* Hapus blok ini jika Anda tidak menyukai efek bayangan putih yang diam di atas dan bawah layar saat di-scroll */}
        <div className="hidden md:flex absolute inset-0 pointer-events-none z-0 flex-col justify-between">
          <div className="sticky top-0 w-full h-0 bg-gradient-to-b from-white dark:from-slate-950 to-transparent" />
          <div className="sticky bottom-0 w-full h-[50vh] bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        </div>
        {/* --- END EDGE FADE EFFECT --- */}

        <div className="relative z-10">
          {/* <ImpactStats /> */}
          <FeaturedWorks />
          {/* <WebDevFeatured /> */}
          <WebDevFeatured />
          <AboutMe />
        </div>
      </div>
      <Footer />
    </main>
  );
}
