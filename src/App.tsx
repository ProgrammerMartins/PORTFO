import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import TerminalSection from "./components/sections/TerminalSection";
import Contact from "./components/sections/Contact";
import ChatWidget from "./components/ai/ChatWidget";
import CommandPalette from "./components/CommandPalette";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface dot-grid transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <CommandPalette />
    </div>
  );
}
