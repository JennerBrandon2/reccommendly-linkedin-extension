(function() {
  function getEducation() {
    try {
      const educationElement = document.querySelector('span[class*="pv-text-details__right-panel"]');
      if (educationElement) {
        console.log("Education element found:", educationElement.innerText.trim());
        return educationElement.innerText.trim();
      } else {
        console.log("Education element not found");
        return "Education information not found";
      }
    } catch (error) {
      console.error("Error getting education information:", error);
      return "Error getting education information";
    }
  }

  function getJobTitle() {
    try {
      let profileComponentElement = document.querySelector('[data-view-name="profile-component-entity"]');
      if (profileComponentElement) {
        let jobTitleElement = profileComponentElement.querySelector('span[aria-hidden="true"]');
        while (jobTitleElement) {
          let jobTitle = jobTitleElement.innerText.trim();
          console.log("Job title found:", jobTitle);
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
            while (jobTitleElement && jobTitleElement.getAttribute("aria-hidden") !== "true") {
              jobTitleElement = jobTitleElement.nextElementSibling;
            }
          } else {
            return jobTitle;
          }
        }
      }
      return "Job title not found";
    } catch (error) {
      console.error("Error getting job title:", error);
      return "Error getting job title";
    }
  }

  function getReferences() {
    try {
      let references = [];
      // Adjusting the selector based on the provided HTML structure
      const referenceElements = document.querySelectorAll('li.pvs-list__item--with-top-padding div.inline-show-more-text span[aria-hidden="true"]');
      console.log("Reference elements found:", referenceElements);
      referenceElements.forEach(element => {
        let referenceText = element.innerText.trim();
        console.log("Reference text found:", referenceText);
        if (referenceText && !referenceText.includes("...")) {  // Exclude collapsed text
          references.push(referenceText);
        }
      });
      if (references.length === 0) {
        console.log("No references found.");
      }
      return references;
    } catch (error) {
      console.error("Error getting references:", error);
      return ["Error getting references"];
    }
  }

  function sendInfoToBackground() {
    const education = getEducation();
    const jobTitle = getJobTitle();
    const references = getReferences();
    console.log("Sending data to background:", { education, jobTitle, references });
    chrome.runtime.sendMessage({ education: education, jobTitle: jobTitle, references: references });
  }

  sendInfoToBackground();
})();
