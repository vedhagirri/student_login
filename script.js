const form = document.getElementById("registrationForm");
const resultMessage = document.getElementById("resultMessage");
const academicCard = document.getElementById("academicCard");
const academicForm = document.getElementById("academicForm");
const formCard = document.getElementById("formCard");
const finalResult = document.getElementById("finalResult");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
const pictureInput = document.getElementById("picture");
const fileHint = document.getElementById("fileHint");
const toast = document.getElementById("toast");
let registrationDetails = {};
const step1Button = document.getElementById("step1Button");
const step2Button = document.getElementById("step2Button");
const stepConnector = document.querySelector(".step-connector");
let step1Completed = false;

function updateRegistrationSteps(currentStep) {
  step1Button.classList.toggle("active", currentStep === 1);
  step2Button.classList.toggle("active", currentStep === 2);
  step1Button.classList.toggle("completed", step1Completed);
  step2Button.classList.toggle("completed", currentStep === 3);
  stepConnector.classList.toggle("completed", step1Completed);
  step1Button.setAttribute("aria-current", currentStep === 1 ? "step" : "false");
  step2Button.setAttribute("aria-current", currentStep === 2 ? "step" : "false");
}

const citiesByState = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"]
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

document.querySelectorAll("[data-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.toggle;
    const menu = document.getElementById(`${name}-menu`);
    const isHidden = menu.classList.toggle("hidden");
    const chevron = button.querySelector(".chevron");
    if (chevron) chevron.textContent = isHidden ? "⌄" : "⌃";
  });
});

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const page = button.dataset.page;
    if (page !== "Practice Form") showToast(`${page} is a navigation demo. The Practice Form is ready to use.`);
  });
});

stateSelect.addEventListener("change", () => {
  const cities = citiesByState[stateSelect.value] || [];
  citySelect.innerHTML = '<option value="">Choose City</option>';
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
  citySelect.disabled = cities.length === 0;
});

pictureInput.addEventListener("change", () => {
  const file = pictureInput.files[0];
  fileHint.textContent = file ? `Selected: ${file.name}` : "Optional image upload; the file is not sent to a server.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const mobile = String(data.get("mobile") || "").trim();
  const age = Number(data.get("age"));
  const gender = data.get("gender");
  if (!/^[0-9]{10}$/.test(mobile)) {
    resultMessage.className = "result-message error";
    resultMessage.textContent = "Please enter a valid 10-digit mobile number.";
    return;
  }
  if (!Number.isInteger(age) || age < 1 || age > 100) {
    resultMessage.className = "result-message error";
    resultMessage.textContent = "Please enter a valid age.";
    return;
  }
  if (!gender) {
    resultMessage.className = "result-message error";
    resultMessage.textContent = "Please select a gender option.";
    return;
  }

  registrationDetails = {
    name: String(data.get("studentName") || "").trim(),
    email: String(data.get("email") || "").trim(),
    age,
    gender,
    mobile,
    dob: data.get("dob") || "Not entered",
    course: data.get("course") || "Not selected",
    state: data.get("state") || "Not selected",
    city: data.get("city") || "Not selected",
    address: String(data.get("address") || "").trim() || "Not entered",
    picture: pictureInput.files[0]?.name || "Not selected"
  };

  step1Completed = true;
  updateRegistrationSteps(2);
  formCard.classList.add("hidden");
  academicCard.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Personal details saved. Enter your academic details.");
});

function goToPersonalDetails() {
  academicCard.classList.add("hidden");
  formCard.classList.remove("hidden");
  updateRegistrationSteps(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

step1Button.addEventListener("click", () => {
  if (step1Completed) goToPersonalDetails();
});

document.getElementById("backToRegistration").addEventListener("click", goToPersonalDetails);

academicForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!academicForm.reportValidity()) return;
  const data = new FormData(academicForm);
  const details = [
    `Name: ${registrationDetails.name}`,
    `Email: ${registrationDetails.email}`,
    `Age: ${registrationDetails.age}`,
    `Gender: ${registrationDetails.gender}`,
    `Mobile: ${registrationDetails.mobile}`,
    `Course: ${registrationDetails.course}`,
    `10th School: ${data.get("tenthSchool")}`,
    `10th Board: ${data.get("tenthBoard")}`,
    `10th Passing Year: ${data.get("tenthYear")}`,
    `10th Marks (%): ${data.get("tenthMarks")}`,
    `12th School: ${data.get("twelfthSchool")}`,
    `12th Board: ${data.get("twelfthBoard")}`,
    `12th Passing Year: ${data.get("twelfthYear")}`,
    `12th Marks (%): ${data.get("twelfthMarks")}`
  ];
  finalResult.innerHTML = "";
  const heading = document.createElement("strong");
  heading.textContent = "Registration completed successfully!";
  const list = document.createElement("ul");
  details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    list.appendChild(item);
  });
  finalResult.append(heading, list);
  finalResult.className = "result-message";
  updateRegistrationSteps(3);
  academicForm.classList.add("hidden");
  showToast(`Thank you, ${registrationDetails.name}! Demo registration completed.`);
});

form.addEventListener("reset", () => {
  step1Completed = false;
  updateRegistrationSteps(1);
  window.setTimeout(() => {
    citySelect.innerHTML = '<option value="">Choose City</option>';
    citySelect.disabled = true;
    resultMessage.className = "result-message hidden";
    resultMessage.textContent = "";
    fileHint.textContent = "Optional image upload; the file is not sent to a server.";
  }, 0);
});
