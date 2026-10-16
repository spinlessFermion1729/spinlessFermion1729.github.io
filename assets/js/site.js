// Site-wide behaviour: name pronunciation and lightweight section reveal.
(function () {
  function initPronunciation() {
    const button = document.querySelector(".sx-pronounce");

    if (!button) {
      return;
    }

    const audio = new Audio(button.dataset.audio);
    audio.preload = "none";

    function setStopped() {
      button.classList.remove("is-speaking");
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", async function () {
      try {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
          setStopped();
          return;
        }

        audio.currentTime = 0;
        button.classList.add("is-speaking");
        button.setAttribute("aria-pressed", "true");
        await audio.play();
      } catch (error) {
        setStopped();
        console.error("Could not play the recorded pronunciation:", error);
      }
    });

    audio.addEventListener("ended", setStopped);
    audio.addEventListener("error", setStopped);
  }

  // Elements marked .sx-reveal fade in once when scrolled into view. Content is visible by
  // default; the hidden state only applies once this script has run (html.sx-reveal-ready).
  function initReveal() {
    const items = document.querySelectorAll(".sx-reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!items.length || reduced || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    items.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        item.classList.add("is-visible");
      } else {
        observer.observe(item);
      }
    });

    document.documentElement.classList.add("sx-reveal-ready");
  }

  function init() {
    initPronunciation();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
