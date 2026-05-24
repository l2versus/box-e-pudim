const shell = document.querySelector("[data-entry-shell]");
const panels = [...document.querySelectorAll("[data-choice]")];
const links = [...document.querySelectorAll("[data-choice-link]")];
const revealNodes = [...document.querySelectorAll("[data-entry-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setActive(choice) {
  if (!shell || !choice) return;
  shell.classList.toggle("is-pudding", choice === "pudding");
  shell.classList.toggle("is-box", choice === "box");
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.choice === choice);
  });
}

panels.forEach((panel) => {
  panel.addEventListener("pointerenter", () => setActive(panel.dataset.choice));
  panel.addEventListener("focusin", () => setActive(panel.dataset.choice));
});

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (reducedMotion) return;

    event.preventDefault();
    const panel = link.closest("[data-choice]");
    setActive(panel?.dataset.choice);
    shell?.classList.add("is-launching");
    panel?.classList.add("is-selected");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 430);
  });
});

window.addEventListener(
  "pointermove",
  (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 44;
    const y = (event.clientY / window.innerHeight - 0.5) * 34;
    document.documentElement.style.setProperty("--mx", `${x.toFixed(2)}px`);
    document.documentElement.style.setProperty("--my", `${y.toFixed(2)}px`);
  },
  { passive: true },
);

function updateScroll() {
  document.documentElement.style.setProperty("--scroll", `${window.scrollY.toFixed(2)}px`);
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
