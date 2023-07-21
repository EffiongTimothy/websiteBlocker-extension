let blockedWebsite = "";
let startTimer = null;
let endTimer = null;
let timerInterval = null;

function cancelRequest(details) {
  if (details.url.includes(blockedWebsite)) {
    return { cancel: true };
  }
}

function blockWebsite(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "block" });
  console.log("tabId-->", tabId);
}

function unblockWebsite(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "unblock" });
  console.log("tabId-->", tabId);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activate") {
    const { domainName, start, end } = message;
    console.log("Received data:", domainName, start, end);
    activate(domainName, start, end, sender);
  }
});

function activate(domainName, start, end, sender) {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const currentTime = new Date();
  const remainingTime = endTime - currentTime;

  console.log("Remaining Time:", remainingTime);
  const seconds = Math.floor(remainingTime / 1000);
  if (seconds >= 0) {
    const seconds = Math.floor(remainingTime / 1000);
    if (startTime === currentTime) {
      console.log(`
    Website ${domainName} is blocked. Countdown: ${seconds} seconds`);
      chrome.runtime.sendMessage({ action: "block" });
    }
    timerInterval = setInterval(() => {
      const updatedTime = endTime - new Date();
      const updatedSeconds = Math.floor(updatedTime / 1000); // Convert updatedTime to seconds
      console.log("Remaining Time:", updatedSeconds);

      if (updatedTime <= 0) {
        clearInterval(timerInterval);
        console.log(domainName, "is not blocked");
        // if (sender && sender.tab && sender.tab.id) {
        //   unblockWebsite(sender.tab.id);
        // }
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    chrome.runtime.sendMessage({ action: "unblock" });
    console.log(domainName, "is not blocked");
  }
}
// if (currentTime >= startTime && currentTime <= endTime) {
//   // Website is within the blocking time interval

//   console.log(`Website ${domainName} is blocked.`);
// } else {
//   // Website is outside the blocking time interval

//   console.log(`Website ${domainName} is not blocked.`);
// }
// }
