export function initRandAudioPlayer() {
  // Configuración de audios aleatorios (sin subtext)
  const audioOptions = [
    {
      src: "/assets/audio/about_me.m4a",
      text: "¿Quieres saber más sobre mí?",
    },
    {
      src: "/assets/audio/about_me_v2.m4a",
      text: "Descubre mi historia profesional",
    },
  ];

  // Seleccionar audio aleatorio
  const randomAudio =
    audioOptions[Math.floor(Math.random() * audioOptions.length)];

  // Configurar elementos
  const audio = document.getElementById("myAudio");
  const playPauseButton = document.getElementById("playPauseButton");
  const audioText = document.getElementById("audioText");
  // const audioSubtext = document.getElementById("audioSubtext"); // No usar

  if (!audio || !playPauseButton) return;

  // Aplicar configuración aleatoria
  audio.src = randomAudio.src;
  if (audioText) audioText.textContent = randomAudio.text;

  // Resto del código del player...
  const playIcon = playPauseButton.querySelector("i");
  let isPlaying = false;

  playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playIcon.className = "ri-play-fill";
      isPlaying = false;
    } else {
      audio.play();
      playIcon.className = "ri-pause-fill";
      isPlaying = true;
    }
  });

  audio.addEventListener("ended", () => {
    playIcon.className = "ri-play-fill";
    isPlaying = false;
  });

  audio.addEventListener("error", (e) => {
    console.error("Error loading audio:", e);
    if (audioText) audioText.textContent = "Audio no disponible";
  });

  console.log(`🎵 Audio cargado: "${randomAudio.text}"`);
}
