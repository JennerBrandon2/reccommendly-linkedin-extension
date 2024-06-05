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
    // Assuming the job title is contained within the "Experience" section
    const experienceSection = document.querySelector('#experience-section');
    if (experienceSection) {
      const jobTitleElement = experienceSection.querySelector('.pv-entity__summary-info h3');
      if (jobTitleElement) {
        return jobTitleElement.innerText.trim();
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
