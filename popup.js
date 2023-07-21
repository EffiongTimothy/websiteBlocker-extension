document.getElementById("startButton").addEventListener("click", function () {
  const domainName = document.getElementById("domain").value;
  const startTimeString = document.getElementById("start-time").value;
  const endTimeString = document.getElementById("end-time").value;

  const startTime = new Date();
  const [startHours, startMinutes] = startTimeString.split(":");
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);

  const endTime = new Date();
  const [endHours, endMinutes] = endTimeString.split(":");
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);

  chrome.runtime.sendMessage({
    action: "activate",
    domainName,
    start: startTime,
    end: endTime,
  });
  console.log('data sent to background--->',domainName, startTime,endTime);
 
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'block') {
    document.documentElement.innerHTML = '<h1>This website is blocked during the specified time.</h1>';
  } else if (message.action === 'unblock') {
    document.documentElement.innerHTML = '';
  }
});
