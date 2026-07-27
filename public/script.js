// API Base URL

const API_BASE_URL = "/api";

// Cached DOM Elements

const authSection = document.getElementById("authSection");
const userSection = document.getElementById("userSection");
const summarizer = document.getElementById("summarizer");

const userName = document.getElementById("userName");

const textInput = document.getElementById("text");
const output = document.getElementById("output");

const wordCount = document.getElementById("wordCount");
const readingTime = document.getElementById("readingTime");

const copyBtn = document.getElementById("copyBtn");
const pdfBtn = document.getElementById("pdfBtn");
const wordBtn = document.getElementById("wordBtn");

const themeBtn = document.getElementById("themeBtn");

// Application State

let currentUser = null;
let authToken = localStorage.getItem("token") || "";

// Page Initialization

window.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  initializeApplication();
});

// Initialize Application

async function initializeApplication() {
  disableSummaryButtons();

  updateReadingStats();

  if (textInput) {
    textInput.addEventListener("input", updateReadingStats);
  }

  if (!authToken) {
    showLoggedOutView();
    return;
  }

  await checkLogin();
}

// UI Helpers

function showLoggedInView(user) {
  currentUser = user;

  authSection.style.display = "none";

  userSection.style.display = "block";

  summarizer.style.display = "block";

  userName.textContent = user.name;

  applyUserTheme(user);
}

function showLoggedOutView() {
  currentUser = null;

  authSection.style.display = "grid";

  userSection.style.display = "none";

  summarizer.style.display = "none";

  clearSummary();

  clearAuthenticationInputs();
}

function clearSummary() {
  textInput.value = "";

  output.textContent = "";

  updateReadingStats();

  disableSummaryButtons();
}

function disableSummaryButtons() {
  copyBtn.disabled = true;
  pdfBtn.disabled = true;
  wordBtn.disabled = true;
}

function enableSummaryButtons() {
  copyBtn.disabled = false;
  pdfBtn.disabled = false;
  wordBtn.disabled = false;
}

function clearAuthenticationInputs() {
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  if (registerName) {
    registerName.value = "";
  }

  if (registerEmail) {
    registerEmail.value = "";
  }

  if (registerPassword) {
    registerPassword.value = "";
  }

  if (loginEmail) {
    loginEmail.value = "";
  }

  if (loginPassword) {
    loginPassword.value = "";
  }
}

// Authentication Helpers

function saveToken(token) {
  authToken = token;

  localStorage.setItem("token", token);
}

function removeToken() {
  authToken = "";

  localStorage.removeItem("token");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
}

// Authentication

async function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Please complete all registration fields.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Registration failed.");
      return;
    }

    saveToken(data.token);

    clearAuthenticationInputs();

    showLoggedInView(data.user);

    alert("Registration successful.");
  } catch (error) {
    console.error(error);

    alert("Unable to register.");
  }
}

// Login

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Login failed.");
      return;
    }

    saveToken(data.token);

    clearAuthenticationInputs();

    showLoggedInView(data.user);

    alert("Login successful.");
  } catch (error) {
    console.error(error);

    alert("Unable to log in.");
  }
}

// Logout

async function logout() {
  try {
    if (authToken) {
      await fetch(
        `${API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
    }
  } catch (error) {
    console.error(error);
  }

  removeToken();

  showLoggedOutView();
}

// Current User Profile

async function loadProfile() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/profile`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response.status === 401) {
      removeToken();
      showLoggedOutView();
      return null;
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error(error);

    return null;
  }
}

// Check Existing Login

async function checkLogin() {
  if (!authToken) {
    showLoggedOutView();
    return;
  }

  const user = await loadProfile();

  if (!user) {
    removeToken();

    showLoggedOutView();

    return;
  }

  showLoggedInView(user);
}

// Authentication Utilities

function isAuthenticated() {
  return authToken !== "";
}

function requireAuthentication() {
  if (!isAuthenticated()) {
    alert("Please log in first.");
    return false;
  }

  return true;
}

// AI Summarization

async function summarize() {
  if (!requireAuthentication()) {
    return;
  }

  const text = textInput.value.trim();

  if (!text) {
    alert("Please paste some text first.");
    return;
  }

  const summaryLength =
    document.getElementById("summaryLength").value;

  output.textContent = "Summarizing...";

  disableSummaryButtons();

  try {
    const response = await fetch(
      `${API_BASE_URL}/summarize`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text,
          summaryLength,
        }),
      }
    );

    if (response.status === 401) {
      alert("Your session has expired.");

      logout();

      return;
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      output.textContent =
        data.message || "Failed to summarize.";

      return;
    }

    output.textContent = data.result;

    enableSummaryButtons();
  } catch (error) {
    console.error(error);

    output.textContent =
      "Unable to connect to the server.";
  }
}

// Summary History

async function loadHistory() {
  if (!requireAuthentication()) {
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/history`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (response.status === 401) {
      logout();
      return [];
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      return [];
    }

    return data.summaries;
  } catch (error) {
    console.error(error);

    return [];
  }
}

// Clear Summary History

async function clearHistory() {
  if (!requireAuthentication()) {
    return;
  }

  const confirmed = confirm(
    "Delete your entire summary history?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/history`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (response.status === 401) {
      logout();
      return;
    }

    const data = await response.json();

    if (!response.ok |!data.success) {
      alert(data.message);

      return;
    }

    alert("Summary history cleared.");
  } catch (error) {
    console.error(error);

    alert("Unable to clear history.");
  }
}

// Refresh Current User

async function refreshUser() {
  if (!requireAuthentication()) {
    return;
  }

  const user = await loadProfile();

  if (!user) {
    logout();
    return;
  }

  showLoggedInView(user);
}

// Copy Summary

async function copySummary() {
  const summary = output.textContent.trim();

  if (!summary || summary === "Summarizing...") {
    alert("There is no summary to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(summary);

    const originalText = copyBtn.textContent;

    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error(error);

    alert("Unable to copy the summary.");
  }
}

// Download PDF

function downloadPDF() {
  const summary = output.textContent.trim();

  if (!summary || summary === "Summarizing...") {
    alert("There is no summary to export.");
    return;
  }

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("AI Text Summary", 20, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);

  const lines = pdf.splitTextToSize(summary, 170);

  pdf.text(lines, 20, 35);

  pdf.save("summary.pdf");
}

// Download Word Document

async function downloadWord() {
  const summary = output.textContent.trim();

  if (!summary || summary === "Summarizing...") {
    alert("There is no summary to export.");
    return;
  }

  const {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
  } = window.docx;

  const paragraphs = summary
    .split("\n")
    .map((line) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line,
          }),
        ],
      });
    });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "AI Text Summary",
                bold: true,
              }),
            ],
          }),

          ...paragraphs,
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "summary.docx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);

    alert("Unable to generate the Word document.");
  }
}

// Reading Statistics

const AVERAGE_READING_SPEED = 200;
const AVERAGE_SPEAKING_SPEED = 130;

function updateReadingStats() {
  if (!textInput) {
    return;
  }

  const text = textInput.value.trim();

  const words = countWords(text);
  const characters = text.length;
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);

  const readingMinutes =
    words === 0
      ? 0
      : Math.max(
          1,
          Math.ceil(words / AVERAGE_READING_SPEED)
        );

  const speakingMinutes =
    words === 0
      ? 0
      : Math.max(
          1,
          Math.ceil(words / AVERAGE_SPEAKING_SPEED)
        );

  if (wordCount) {
    wordCount.textContent =
      `Words: ${words.toLocaleString()}`;
  }

  if (readingTime) {
    readingTime.textContent =
      `Reading Time: ${readingMinutes} min`;
  }

  const characterCount =
    document.getElementById("characterCount");

  if (characterCount) {
    characterCount.textContent =
      `Characters: ${characters.toLocaleString()}`;
  }

  const sentenceCount =
    document.getElementById("sentenceCount");

  if (sentenceCount) {
    sentenceCount.textContent =
      `Sentences: ${sentences.toLocaleString()}`;
  }

  const paragraphCount =
    document.getElementById("paragraphCount");

  if (paragraphCount) {
    paragraphCount.textContent =
      `Paragraphs: ${paragraphs.toLocaleString()}`;
  }

  const speakingTime =
    document.getElementById("speakingTime");

  if (speakingTime) {
    speakingTime.textContent =
      `Speaking Time: ${speakingMinutes} min`;
  }
}

// Statistics Helpers

function countWords(text) {
  if (!text) {
    return 0;
  }

  return text
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .length;
}

function countSentences(text) {
  if (!text) {
    return 0;
  }

  return text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0)
    .length;
}

function countParagraphs(text) {
  if (!text) {
    return 0;
  }

  return text
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .length;
}

// Reset Statistics

function resetReadingStats() {
  if (wordCount) {
    wordCount.textContent = "Words: 0";
  }

  if (readingTime) {
    readingTime.textContent =
      "Reading Time: 0 min";
  }

  const characterCount =
    document.getElementById("characterCount");

  if (characterCount) {
    characterCount.textContent =
      "Characters: 0";
  }

  const sentenceCount =
    document.getElementById("sentenceCount");

  if (sentenceCount) {
    sentenceCount.textContent =
      "Sentences: 0";
  }

  const paragraphCount =
    document.getElementById("paragraphCount");

  if (paragraphCount) {
    paragraphCount.textContent =
      "Paragraphs: 0";
  }

  const speakingTime =
    document.getElementById("speakingTime");

  if (speakingTime) {
    speakingTime.textContent =
      "Speaking Time: 0 min";
  }
}

// Dark Mode

function toggleTheme() {
  const isDarkMode = document.body.classList.toggle("dark");

  const theme = isDarkMode ? "dark" : "light";

  localStorage.setItem("theme", theme);

  updateThemeButton();

  saveThemePreference(theme);
}

// Theme Helpers

function updateThemeButton() {
  if (!themeBtn) {
    return;
  }

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "Light Mode";
  } else {
    themeBtn.textContent = "Dark Mode";
  }
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);

  updateThemeButton();
}

function initializeTheme() {
  const savedTheme =
    localStorage.getItem("theme") || "light";

  applyTheme(savedTheme);
}

/*
  Save Theme Preference
  If the user is authenticated, save the preference
  to the server as well.
*/

async function saveThemePreference(theme) {
  if (!authToken) {
    return;
  }

  try {
    await fetch(
      `${API_BASE_URL}/auth/theme`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          theme,
        }),
      }
    );
  } catch (error) {
    console.error(error);
  }
}

//Apply User Theme

function applyUserTheme(user) {
  if (!user) {
    return;
  }

  if (user.theme) {
    applyTheme(user.theme);
  }
}

// Utility Functions

function showNotification(message) {
  alert(message);
}

function hasSummary() {
  const summary = output.textContent.trim();

  return (
    summary !== "" &&
    summary !== "Summarizing..."
  );
}

function updateExportButtons() {
  if (hasSummary()) {
    enableSummaryButtons();
  } else {
    disableSummaryButtons();
  }
}

// Authenticated Fetch Helper

async function authenticatedFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    alert("Your session has expired.");

    logout();

    throw new Error("Unauthorized");
  }

  return response;
}

// Keyboard Shortcuts

document.addEventListener("keydown", (event) => {
  /*
    Ctrl + Enter (Windows/Linux)
    Cmd + Enter (macOS)
  */

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === "Enter"
  ) {
    if (
      document.activeElement === textInput &&
      requireAuthentication()
    ) {
      summarize();
    }
  }

  // Enter on Login Password

  if (
    event.key === "Enter" &&
    document.activeElement ===
      document.getElementById("loginPassword")
  ) {
    login();
  }

  // Enter on Register Password

  if (
    event.key === "Enter" &&
    document.activeElement ===
      document.getElementById("registerPassword")
  ) {
    register();
  }
});

// Live Reading Statistics

if (textInput) {
  textInput.addEventListener("input", () => {
    updateReadingStats();
  });

  textInput.addEventListener("paste", () => {
    setTimeout(updateReadingStats, 0);
  });

  textInput.addEventListener("keyup", () => {
    updateReadingStats();
  });
}

// Observe Summary Changes

const summaryObserver = new MutationObserver(() => {
  updateExportButtons();
});

summaryObserver.observe(output, {
  childList: true,
  subtree: true,
  characterData: true,
});

// Window Events

window.addEventListener("beforeunload", () => {
  updateExportButtons();
});

// Startup

updateExportButtons();
updateReadingStats();
