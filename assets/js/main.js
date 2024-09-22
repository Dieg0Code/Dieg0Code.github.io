import { initTabs } from "./tabs.js";
import { initAudioPlayer } from "./audio.js";
import { initScrollReveal } from "./scrollReveal.js";
import { initTextScramble } from "./textScramble.js";
import { initAIAssistant } from "./aiAssistant.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAudioPlayer();
  initScrollReveal();
  initTextScramble();
  initAIAssistant();
});