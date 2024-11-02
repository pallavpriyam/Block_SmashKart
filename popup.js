document.addEventListener("DOMContentLoaded", () => {
    // Get the remaining time and update the display
    chrome.storage.local.get(["unblockTime"], (result) => {
        const unblockTime = result.unblockTime || 0;
        const currentTime = Date.now();
        
        if (currentTime < unblockTime) {
            const timeLeft = Math.ceil((unblockTime - currentTime) / 1000); // Convert to seconds
            document.getElementById("timeRemaining").textContent = `${timeLeft} seconds`;
        } else {
            document.getElementById("timeRemaining").textContent = "No active blocks.";
        }
    });
});
