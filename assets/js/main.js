import { initTabs } from "./tabs.js";
import { initAudioPlayer } from "./audio.js";
import { initScrollReveal } from "./scrollReveal.js";
import { initTextScramble } from "./textScramble.js";
import { initAIAssistant } from "./aiAssistant.js";
import { initNeuralWaves } from "./bgParticles.js";
import { initRandAudioPlayer } from "./randAudio.js";

// Función para el efecto de scroll en navbar
function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Función para marcar enlaces activos del navbar
function initActiveNavLinks() {
  const navLinks = document.querySelectorAll(".navbar__link");
  const sections = document.querySelectorAll("section[id]");

  function changeActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", changeActiveLink);
}

// Función para inicializar efectos de tarjetas de proyectos
function initProjectCards() {
  const cards = document.querySelectorAll(".projects-section__card");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("loaded");
    }, (index + 1) * 500 + 800); // Espera a que termine la animación de entrada
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initAudioPlayer();
  initScrollReveal();
  initTextScramble();
  initAIAssistant();
  initNeuralWaves();

  // Agregar las nuevas funciones
  initNavbarScroll();
  initActiveNavLinks();
  initProjectCards();
  initRandAudioPlayer();
});
