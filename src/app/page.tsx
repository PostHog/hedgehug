import { Hero } from "@/components/home/hero"
import { FeaturedHedgehogs } from "@/components/hedgehogs/featured-hedgehogs"
import { AboutSection } from "@/components/home/about-section"

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedHedgehogs />
      <AboutSection />
    </>
  )
}
