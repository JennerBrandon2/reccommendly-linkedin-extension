document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scrapeProfile').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeProfile" }, (response) => {
          chrome.storage.local.set({ profileData: response.data }, () => {
            displayData(response.data);
          });
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
    <h2>Job Titles</h2>
    <ul>${data.jobTitles.map(title => `<li>${title}</li>`).join('')}</ul>
  `;
}
