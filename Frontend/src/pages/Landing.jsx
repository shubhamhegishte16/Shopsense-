import Navbar from '../components/landing/Navbar'
import ScrollHeroSection from '../components/landing/ScrollHeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import AnalyticsSection from '../components/landing/AnalyticsSection'
import DNASection from '../components/landing/DNASection'
import ChatbotSection from '../components/landing/ChatbotSection'
import FAQSection from '../components/landing/FAQSection'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollHeroSection />
        <FeaturesSection />
        <AnalyticsSection />
        <DNASection />
        <ChatbotSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
