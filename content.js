(function() {
  function getEducation() {
    const educationElement = document.querySelector('span[class*="pv-text-details__right-panel"]');
    if (educationElement) {
      return educationElement.innerText.trim();
    } else {
      return "Education information not found";
    }
  }

  function getJobTitle() {
    // Locate the first element with data-view-name="profile-component-entity"
    let profileComponentElement = document.querySelector('[data-view-name="profile-component-entity"]');
    if (profileComponentElement) {
      // Find the first span with aria-hidden="true" within the profileComponentElement
      let jobTitleElement = profileComponentElement.querySelector('span[aria-hidden="true"]');
      while (jobTitleElement) {
        let jobTitle = jobTitleElement.innerText.trim();
        // Check if the job title contains unwanted text and move to next span if needed
        if (jobTitle.includes("mutual groups") ||
            jobTitle.includes("mutual group") ||
            jobTitle.includes("1 mutual group") ||
            jobTitle.includes("Job title not found") ||
            jobTitle.includes("you both worked") ||
            jobTitle.includes("you both work") ||
            jobTitle.includes("You both work") ||
            jobTitle.includes("follows you") ||
            jobTitle.includes("Follows you") ||
            jobTitle === "") {
          jobTitleElement = jobTitleElement.nextElementSibling;
          // Ensure we skip over spans until we find a valid job title
          while (jobTitleElement && jobTitleElement.getAttribute("aria-hidden") !== "true") {
            jobTitleElement = jobTitleElement.nextElementSibling;
          }
        } else {
          return jobTitle;
        }
      }
    }
    return "Job title not found";
  }

  // Function to send the information to the background script
  function sendInfoToBackground() {
    const education = getEducation();
    const jobTitle = getJobTitle();
    chrome.runtime.sendMessage({ education: education, jobTitle: jobTitle });
  }

  // Invoke the function to send information
  sendInfoToBackground();
})();
