chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "startCountdown") {
    let countdownContainer = document.getElementById("countdownContainer");

    if (!countdownContainer) {
      countdownContainer = document.createElement("div");
      countdownContainer.id = "countdownContainer";
      countdownContainer.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
      `;
      document.body.appendChild(countdownContainer);
    }

    countdownContainer.textContent = `Time remaining: ${request.timeLeft} seconds`;

    if (request.timeLeft <= 0) {
      countdownContainer.remove();
    }
  }
});
