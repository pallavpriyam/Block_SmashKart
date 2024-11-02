let blockTimer = 10 * 60 * 1000; // Countdown time: 10 minutes
let blockDuration = 10 * 60 * 1000; // Block duration: 1 hour
let monitoredUrl = "https://smashkarts.io"; // Replace with the URL you want to monitor
let countdownInterval;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes(monitoredUrl)) {
    // Check the stored unblock time to see if the site should still be blocked
    chrome.storage.local.get(["unblockTime"], (result) => {
      const unblockTime = result.unblockTime || 0;
      const currentTime = Date.now();

      console.log(`Current time: ${currentTime}, Stored unblock time: ${unblockTime}`);

      if (currentTime < unblockTime) {
        // Site is still in blocked period
        console.log("Blocking the site as it is within the blocked period.");
        showBlockedPage(tabId);
      } else {
        // Start a new countdown since the block has expired
        console.log("Starting countdown for this tab.");
        startCountdown(tabId);
      }
    });
  }
});

function startCountdown(tabId) {
  let endTime = Date.now() + blockTimer;

  clearInterval(countdownInterval); // Clear any existing countdown interval
  countdownInterval = setInterval(() => {
    let timeLeft = endTime - Date.now();

    console.log(`Countdown time left for tab ${tabId}: ${timeLeft} ms`);

    chrome.action.setBadgeText({
      text: timeLeft > 0 ? Math.ceil(timeLeft / 1000).toString() : "",
      tabId: tabId
    });

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      blockSite(tabId);
    }
  }, 1000);
}

function blockSite(tabId) {
  const unblockTime = Date.now() + blockDuration;
  console.log(`Blocking site. Unblocking time set to: ${unblockTime}`);

  // Save the unblock time in persistent storage to keep it across browser sessions
  chrome.storage.local.set({ unblockTime: unblockTime }, () => {
    showBlockedPage(tabId);
  });
}

function showBlockedPage(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: red; color: white;">
          <h1>This site is blocked</h1>
        </div>`;
    }
  });

  // Clear the countdown badge
  chrome.action.setBadgeText({ text: "", tabId: tabId });
}
