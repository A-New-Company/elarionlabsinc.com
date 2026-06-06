import { WaitlistProvider } from "@/components/WaitlistProvider";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Promise from "@/components/sections/Promise";
import Capabilities from "@/components/sections/Capabilities";
import Showcase from "@/components/sections/Showcase";
import HowItWorks from "@/components/sections/HowItWorks";
import SocialProof from "@/components/sections/SocialProof";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <WaitlistProvider>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Promise />
        <Capabilities />
        <Showcase />
        <HowItWorks />
        <SocialProof />
        <Waitlist />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}
