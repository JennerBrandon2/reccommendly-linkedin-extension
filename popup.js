document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scrapeProfile').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        // Listener for messages from the content script
        chrome.runtime.onMessage.addListener((message) => {
          if (message.education || message.jobTitle) {
            const data = {
              education: message.education,
              jobTitle: message.jobTitle
            };
            displayData(data);
            chrome.storage.local.set({ profileData: data });
          }
        });
      });
    });
  });

  // Load and display data if already available
  chrome.storage.local.get(['profileData'], (result) => {
    if (result.profileData) {
      displayData(result.profileData);
    }
  });
});

function displayData(data) {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = `
    <h2>Education Information</h2>
    <p>${data.education}</p>
    <h2>Job Title</h2>
    <p>${data.jobTitle}</p>
  `;
}
