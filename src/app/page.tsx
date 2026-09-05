import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { Gallery } from "@/components/Gallery";
import { FeaturedBanner } from "@/components/FeaturedBanner";
import { LatestPosts } from "@/components/LatestPosts";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { JsonLd } from "@/components/JsonLd";
import { homeSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <WhyChooseUs />
        <EmergencyBanner />
        <Gallery />
        <FeaturedBanner />
        <LatestPosts />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
      <JsonLd id="home-schema" data={homeSchema()} />
    </>
  );
}
