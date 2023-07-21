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
chrome.tabs.sendMessage(tabId, { action: 'block' });
}

function unblockWebsite(tabId) {
chrome.tabs.sendMessage(tabId, { action: 'unblock' });
}

function timer(endTimer, startTimer, blockedWebsite) {
const currentTime = new Date();
const remainingTime = endTimer - currentTime;
console.log("Remaining Time:", remainingTime);

if (remainingTime >= 0) {
const seconds = Math.floor(remainingTime / 1000);
console.log(`
Website ${blockedWebsite} is blocked. Countdown: ${seconds} seconds`
);

if (!blockedWebsite) {
  blockWebsite(tabId);
}

timerInterval = setInterval(() => {
  const updatedTime = endTimer - new Date();
  const updatedSeconds = Math.floor(updatedTime / 1000); // Convert updatedTime to seconds
  console.log("Remaining Time:", updatedSeconds);

  if (updatedTime <= 0) {
    clearInterval(timerInterval);
    console.log(blockedWebsite, "is not blocked");
    unblockWebsite(tabId);
  }
}, 1000);
} else {
clearInterval(timerInterval);
console.log(blockedWebsite, "is not blocked");
}
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'activate') {
      const { domainName, start, end } = message;
      console.log('Received data:', domainName, start, end);
      activate(domainName, start, end);
    }
  });
});

function activate(domainName, start, end) {
  blockedWebsite = domainName;
  startTimer = new Date(start);
  endTimer = new Date(end);
  console.log("activate data-->", startTimer, endTimer);

  // Get the ID of the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      tabId = tabs[0].id;

      // Delay the message by a few seconds
      setTimeout(() => {
        timer(endTimer, startTimer, blockedWebsite);
      }, 3000);
    } else {
      console.error('No active tabs found.');
    }
  });
}