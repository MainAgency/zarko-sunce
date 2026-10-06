import { About } from "@/components/About";
import { Blog } from "@/components/Blog";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NewsPortal } from "@/components/NewsPortal";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { CONTACT } from "@/lib/content";
import { buildBusinessJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = buildBusinessJsonLd({
    phone: CONTACT.phone,
    email: CONTACT.email,
    logo: "/brand/zarko-sunce-logo.webp",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroCarousel />
      <Services />
      <About />
      <Projects />
      <NewsPortal />
      <Blog />
      <div id="kontakt">
        <LetsWorkTogether href="/kontakt" email={CONTACT.email} />
      </div>
    </>
  );
}
