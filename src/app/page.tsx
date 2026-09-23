import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Practice } from "@/components/Practice";
import { Method } from "@/components/Method";
import { Descent } from "@/components/Descent";
import { Start } from "@/components/Start";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link btn btn-hover">
        Saltar al contenido
      </a>
      <Nav />
      <main
        id="contenido"
        tabIndex={-1}
        className="relative z-[1] bg-ground outline-none"
        style={{ marginBottom: "calc(100vh + 2px)" }}
      >
        <Hero />
        {/* Cover handoff: todo lo posterior se desliza por encima del hero pinneado. */}
        <div className="relative z-10 -mt-[100svh]">
          <Practice />
          <Method />
          <Descent />
          <Start />
        </div>
      </main>
      <Footer />
    </>
  );
}
