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
      <FeaturedWorks />
      <AboutMe />
      <Gallery />
      <Certificates />
      <Footer />
    </main>
  );
}
