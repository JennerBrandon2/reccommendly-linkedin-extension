document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scrapeProfile').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        chrome.runtime.onMessage.addListener((message) => {
          if (message.education || message.jobTitle || message.references) {
            const data = {
              education: message.education,
              jobTitle: message.jobTitle,
              references: message.references
            };
            displayData(data);
            chrome.storage.local.set({ profileData: data });
          }
        });
      });
    });
  });

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
    <h2>References</h2>
    ${data.references.length > 0
      ? `<ul>${data.references.map(reference => `<li>${reference}</li>`).join('')}</ul>`
      : `<p>No References on Reccommendly. <a href="https://www.reccommendly.com.au/account/leavereference" target="_blank">Leave a reference now</a>.</p>`}
  `;
}
