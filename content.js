function scrapeLinkedInProfile() {
  let profileData = {};

  // Extracting job titles
  let jobTitles = Array.from(document.querySelectorAll('.display-flex.align-items-center.mr1.t-bold span[aria-hidden="true"]'))
    .map(el => el.innerText.trim());

  profileData.jobTitles = jobTitles;

  return profileData;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProfile") {
    let data = scrapeLinkedInProfile();
    sendResponse({ data: data });
  }
});
