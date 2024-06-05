(async function() {
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
      const referenceElements = document.querySelectorAll('li.pvs-list__item--with-top-padding div.inline-show-more-text span[aria-hidden="true"]');
      console.log("Reference elements found:", referenceElements);
      referenceElements.forEach(element => {
        let referenceText = element.innerText.trim();
        console.log("Reference text found:", referenceText);
        if (referenceText && !referenceText.includes("...")) {
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

  async function getDISCType(jobTitle, education, retries = 5) {
    const apiKey = 'sk-proj-TaZbcE0WyfsMl26hIcuST3BlbkFJvP21m7fLmUpA4NIXLuTk';  // Replace with your OpenAI API key
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const messages = [
      { "role": "user", "content": `Job Title: ${jobTitle}\nEducation: ${education}\nDo not provide any context, just an answer,
Do not repeat what you are told, do not repeat the job title, do not repeat the education
Do not go through DISC, just answer which 1 they are and 2 likely strenghts and 2 likely weaknesses
Act as a DISC expert and provide a disk analysis for profile with Please analyze the DISC personality type based on the provided job title and education. ALWAYS provide a DISC, even if you are not sure` }
    ];

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7
          })
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : (2 ** i) * 1000;  // Exponential backoff
          console.log(`Rate limited. Retrying after ${waitTime / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(`Error: ${response.statusText}`);
        } else {
          const data = await response.json();
          console.log("OpenAI response:", data);
          return data.choices && data.choices.length > 0 ? data.choices[0].message.content.trim() : 'No DISC type found';
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    }

    return 'No DISC type found after retries';
  }

  async function sendInfoToBackground() {
    const education = getEducation();
    const jobTitle = getJobTitle();
    const references = getReferences();
    const discType = await getDISCType(jobTitle, education);

    console.log("Sending data to background:", { education, jobTitle, references, discType });
    chrome.runtime.sendMessage({ education: education, jobTitle: jobTitle, references: references, discType: discType });
  }

  sendInfoToBackground();
})();
