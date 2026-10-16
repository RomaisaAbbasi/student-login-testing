"use strict";

const STORAGE_KEY = "studentPortalAccounts";
const SESSION_KEY = "studentPortalCurrentUser";
const DEMO_ACCOUNT = { name: "Demo Student", email: "demo@student.com", password: "Student123" };

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authCard = document.getElementById("authCard");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");
const dashboardName = document.getElementById("dashboardName");
const logoutButton = document.getElementById("logoutButton");

function readAccounts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function ensureDemoAccount() {
  const accounts = readAccounts();
  if (!accounts.some((account) => account.email === DEMO_ACCOUNT.email)) {
    accounts.push(DEMO_ACCOUNT);
    saveAccounts(accounts);
  }
}

function showMessage(text, type = "error") {
  message.textContent = text;
  message.classList.toggle("success", type === "success");
}

function clearMessage() {
  message.textContent = "";
  message.classList.remove("success");
}

function switchForm(formToShow) {
  const registrationIsOpen = formToShow === "register";
  loginForm.hidden = registrationIsOpen;
  registerForm.hidden = !registrationIsOpen;
  loginTab.classList.toggle("active", !registrationIsOpen);
  registerTab.classList.toggle("active", registrationIsOpen);
  loginTab.setAttribute("aria-selected", String(!registrationIsOpen));
  registerTab.setAttribute("aria-selected", String(registrationIsOpen));
  clearMessage();
}

function showDashboard(account) {
  authCard.hidden = true;
  dashboard.hidden = false;
  dashboardName.textContent = account.name;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: account.name, email: account.email }));
}

function showLoginScreen() {
  sessionStorage.removeItem(SESSION_KEY);
  dashboard.hidden = true;
  authCard.hidden = false;
  loginForm.reset();
  registerForm.reset();
  switchForm("login");
}

loginTab.addEventListener("click", () => switchForm("login"));
registerTab.addEventListener("click", () => switchForm("register"));
showRegister.addEventListener("click", () => switchForm("register"));
showLogin.addEventListener("click", () => switchForm("login"));

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    showMessage("Please fill in all fields.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long.");
    return;
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === email)) {
    showMessage("An account with this email already exists.");
    return;
  }

  accounts.push({ name, email, password });
  saveAccounts(accounts);
  registerForm.reset();
  switchForm("login");
  document.getElementById("loginEmail").value = email;
  showMessage("Account created successfully. Please log in.", "success");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }
  const account = readAccounts().find((item) => item.email.toLowerCase() === email && item.password === password);
  if (!account) {
    showMessage("Invalid email or password.");
    return;
  }
  clearMessage();
  showDashboard(account);
});

logoutButton.addEventListener("click", showLoginScreen);

ensureDemoAccount();
try {
  const currentUser = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  if (currentUser && currentUser.email) {
    const account = readAccounts().find((item) => item.email === currentUser.email);
    if (account) showDashboard(account);
  }
} catch (error) {
  sessionStorage.removeItem(SESSION_KEY);
}
