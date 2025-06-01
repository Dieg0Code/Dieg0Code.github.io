export function initAudioPlayer() {
  const audio = document.getElementById("myAudio");
  const playPauseButton = document.getElementById("playPauseButton");
  const icon = playPauseButton.querySelector("i");

  if (audio && playPauseButton && icon) {
    playPauseButton.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        icon.classList.remove("ri-play-fill");
        icon.classList.add("ri-pause-fill");
      } else {
        audio.pause();
        icon.classList.remove("ri-pause-fill");
        icon.classList.add("ri-play-fill");
      }
    });

    audio.addEventListener("ended", () => {
      icon.classList.remove("ri-pause-fill");
      icon.classList.add("ri-play-fill");
    });
  } else {
    console.error("No se encontró el elemento de audio o el botón.");
  }
}
