// Store user credentials in memory
const users = {};

// Get elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const welcomePage = document.getElementById("welcomePage");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const signUpLink = document.getElementById("signUpLink");
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const welcomeUsername = document.getElementById("welcomeUsername");

// Function to display a custom alert message
function showAlert(message, type = "error", stayVisible = false) {
  const existingAlert = document.querySelector(".alert-message");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.classList.add("alert-message");

  // Set the color and background color based on message type (success or error)
  if (type === "success") {
    alertDiv.style.color = "#fff";  
    alertDiv.style.backgroundColor = "#28a745";  // Green for success
  } else {
    alertDiv.style.color = "#fff";  
    alertDiv.style.backgroundColor = "#dc3545";  // Red for error
  }

  alertDiv.style.padding = "10px";  
  alertDiv.style.marginBottom = "3px";  
  alertDiv.style.textAlign = "center";  

  // Insert the alert message above the relevant button
  if (signupForm.style.display === "block") {
    signupForm.insertBefore(alertDiv, signupBtn);  
  } else {
    loginForm.insertBefore(alertDiv, loginBtn);  
  }

  // Automatically hide the alert after 3 seconds if not set to stay visible
  if (!stayVisible) {
    setTimeout(() => {
      alertDiv.style.display = "none";
    }, 3000);
  }
}

// Switch to Sign-Up form
signUpLink.addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  localStorage.setItem("formState", "signup");  // Save form state to localStorage
});

// Switch to Login form
loginLink.addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  localStorage.setItem("formState", "login");  // Save form state to localStorage
});

// Sign-Up Logic
signupBtn.addEventListener("click", () => {
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  // Clear any existing alerts
  const alertMessage = document.querySelector(".alert-message");
  if (alertMessage) {
    alertMessage.style.display = "none";
  }

  if (!username || !email || !password) {
    showAlert("All fields are required");  
    return;
  }

  if (users[email]) {
    showAlert("Email already in use");  
    return;
  }

  // Create new user
  users[email] = { username, password };

  // Show success message after sign-up
  showAlert("Account created successfully!", "success", true);

  // Wait for the success message to show before switching forms
  setTimeout(() => {
    localStorage.setItem("formState", "login");  // Switch to login form after successful signup
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }, 3000);  // Wait 3 seconds before hiding the sign-up form and showing the login form
});

// Login Logic
loginBtn.addEventListener("click", () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  // Clear any existing alerts
  const alertMessage = document.querySelector(".alert-message");
  if (alertMessage) {
    alertMessage.style.display = "none";
  }

  if (!email || !password) {
    showAlert("All inputs are required");  
    return;
  }

  // User not found or incorrect password check
  if (!users[email] || users[email].password !== password) {
    showAlert("Incorrect email or password");  
    return;
  }

  // Successful login
  const username = users[email].username;
  welcomeUsername.textContent = username;
  loginForm.style.display = "none";
  welcomePage.style.display = "block";

  // Clear the inputs
  clearFormInputs(loginForm);
});

// Logout Logic
logoutBtn.addEventListener("click", () => {
  // Clear the form inputs and switch to login page
  clearFormInputs(loginForm);
  welcomePage.style.display = "none";
  loginForm.style.display = "block";
  localStorage.setItem("formState", "login");  // Save form state to localStorage
});

// Clear input fields
function clearFormInputs(form) {
  const inputs = form.querySelectorAll("input");
  inputs.forEach(input => {
    input.value = "";
  });
}
