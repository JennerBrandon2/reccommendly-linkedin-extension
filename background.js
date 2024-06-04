chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, () => {
    chrome.tabs.sendMessage(tab.id, { action: "scrapeProfile" }, (response) => {
      console.log('Profile data:', response.data);
      saveData(response.data);
    });
  });
});

function saveData(data) {
  chrome.storage.local.set({ profileData: data }, () => {
    console.log('Data saved to local storage.');
  });
}
