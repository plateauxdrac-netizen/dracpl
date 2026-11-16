import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const REVEAL_SELECTOR = [
  ".section-heading",
  ".page-banner > .wrap",
  ".prose",
  ".filters",
  ".institution-row",
  ".contact-info-card",
  ".map-card",
].join(",");
const REVEAL_GROUP_SELECTOR = [
  ".section > .wrap > .grid-3",
  ".section > .wrap > .news-grid",
  ".section > .wrap > .gallery",
  ".section > .wrap > .partner-grid",
  ".news-side",
].join(",");

/** Adds motion only after hydration, so content remains visible without JavaScript. */
export function PortalMotion() {
  useEffect(() => {
    const preferences = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preferences.matches) return;

    const root = document.documentElement;
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    const register = (node: ParentNode) => {
      for (const element of node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)) {
        if (element.dataset["reveal"]) continue;
        element.dataset["reveal"] = "";
        observer.observe(element);
      }
      for (const element of node.querySelectorAll<HTMLElement>(REVEAL_GROUP_SELECTOR)) {
        if (element.dataset["revealGroup"]) continue;
        element.dataset["revealGroup"] = "";
        observer.observe(element);
      }
    };

    register(document);
    const mutations = new MutationObserver((entries) => {
      for (const entry of entries) {
        for (const node of entry.addedNodes) {
          if (node instanceof HTMLElement) register(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return <BackToTop />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 650);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Button
      type="button"
      size="icon"
      className={`back-to-top ${visible ? "visible" : ""}`}
      aria-label="Retour en haut de la page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title="Retour en haut"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
}
