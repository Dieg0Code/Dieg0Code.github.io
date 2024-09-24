export function initAIAssistant() {
  const modal = document.getElementById("aiAssistantModal");
  const btn = document.querySelector(".profile__buttons-small a");
  const span = document.getElementsByClassName("close")[0];
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const clearButton = document.getElementById("clearButton");
  const chatHistory = document.getElementById("chatHistory");

  let chatHistoryArray = [];

  // Función para mostrar el modal con animación
  const openModal = () => {
    modal.classList.add("show");
    modal.style.display = "block";
    document.getElementById("chatInput").focus();
  };

  // Función para cerrar el modal con animación
  const closeModal = () => {
    modal.classList.remove("show");
    // Esperar a que la animación termine antes de ocultar el modal
    setTimeout(() => {
      modal.style.display = "none";
    }, 400); // Tiempo igual a la duración de la animación
  };

  // Open the modal
  btn.onclick = function (event) {
    event.preventDefault();
    openModal();
  };

  // Open the modal on ctrl + i key press
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "i") {
      openModal();
    }
  });

  // Close the modal
  span.onclick = function () {
    closeModal();
  };

  // Close the modal when clicking outside
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };

  // Close modal on Esc key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Send message on button click
  sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    sendMessage();
  });

  // Send message on Enter key press
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Clear chat history on button click
  clearButton.addEventListener("click", function (event) {
    event.preventDefault();
    chatHistory.innerHTML = ""; // Limpiar el historial
    chatHistoryArray = []; // Limpiar el historial
  });

  // Clear chat history on ctrl + l key press
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "l") {
      chatHistory.innerHTML = ""; // Limpiar el historial
      chatHistoryArray = []; // Limpiar el historial
    }
  });

  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessageToChat("Tu", message);
      chatInput.value = "";
      chatHistoryArray.push({
        role: "user",
        content: message,
      });
      fetchResponse(message);
    }
  }

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    
    // Renderiza el mensaje como markdown
    const renderedMessage = marked.parse(message);
    
    messageElement.innerHTML = `<strong>${sender}:</strong> ${renderedMessage}`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  async function fetchResponse(query) {
    try {
      const response = await fetch(
        "https://7m5vu6grr1.execute-api.sa-east-1.amazonaws.com/dev/api/v1/diary/rag-response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            history: { messages: chatHistoryArray },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.code === 200) {
        addMessageToChat("PIA", data.data);
        chatHistoryArray.push({ role: "assistant", content: data.data });
      } else {
        addMessageToChat(
          "PIA",
          `Lo siento, ocurrió un error: ${data.message || "Desconocido"}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      addMessageToChat("PIA", `Lo siento, ocurrió un error: ${error.message}`);
    }
  }
}
