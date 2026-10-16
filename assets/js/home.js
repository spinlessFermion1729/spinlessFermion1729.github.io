// Home page: recorded pronunciation of the name.
(function () {
  function init() {
    const button = document.querySelector(".ed-pronounce");

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
