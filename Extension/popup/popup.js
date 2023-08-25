// notify background script that popup is open
chrome.runtime.connect({ name: "popup" });

// receive selected text from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "passSelectedText") {
    const selectedText = message.selected;
    // change placeholder text of event title to selected text
    const eventTitle = document.getElementById("eventTitle");
    eventTitle.placeholder = selectedText;
    eventTitle.value = selectedText;
    // document.getElementById("selectedText").textContent = selectedText;
  } else if (message.action === "getUUID") {
    const uuid = message.uuid;
    document.getElementById("uuid").textContent = uuid;
  }
});

const pages = ["title", "date", "time", "location"];
var currentPage = 0;
document.getElementById(pages[currentPage]).style.visibility = "visible";
const submitBtn = document.getElementById("submitInput");

// Handle pages of form
// next page
const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", () => {
  if (currentPage >= 3) {
    return;
  }

  currentPage++;
  document.getElementById(pages[currentPage - 1]).style.visibility = "hidden";
  document.getElementById(pages[currentPage]).style.visibility = "visible";
  if (currentPage == 2) {
    const startTime = document.getElementById("eventTime");
    startTime.addEventListener("change", () => {
      let [hours, minutes] = startTime.value.split(":");

      // Convert hours and minutes to numbers
      let hoursNum = parseInt(hours);
      let minutesNum = parseInt(minutes);

      // Add one hour
      hoursNum = (hoursNum + 1) % 24;

      // Format the new time
      let newTimeString = `${hoursNum
        .toString()
        .padStart(2, "0")}:${minutesNum}`;
      const endTime = document.getElementById("eventEndTime");
      endTime.value = newTimeString;
    });
  }
  if (currentPage === 3) {
    nextBtn.style.visibility = "hidden";
    submitBtn.style.visibility = "visible";
  }
});
// previous page
const prevBtn = document.getElementById("prevBtn");
prevBtn.addEventListener("click", () => {
  if (currentPage <= 0) {
    return;
  }
  currentPage--;
  document.getElementById(pages[currentPage + 1]).style.visibility = "hidden";
  document.getElementById(pages[currentPage]).style.visibility = "visible";

  nextBtn.style.visibility = "visible";
  submitBtn.style.visibility = "hidden";
});

// Form submit:
const submitForm = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  chrome.runtime.sendMessage({
    action: "passFormData",
    form: formProps,
  });
  window.close();
};

const loginForm = document.getElementById("eventForm");
loginForm.addEventListener("submit", submitForm);
