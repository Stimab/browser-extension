import { data } from "./data.js";

const STORAGE_KEY = "toggleStates";
const savedStates = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

const mainGrid = document.querySelector(".js-main-grid");

// Helper to get current active state for an item
function getIsActive(item) {
  return savedStates[item.name] !== undefined
    ? savedStates[item.name]
    : item.isActive;
}

// Builds the HTML for one card
function buildCard(item) {
  const isActive = getIsActive(item);

  return `<div
  class="bg-neutral-0 p-5 pb-[3.70rem] rounded-[1.1rem] shadow-md dark:bg-neutral-800 dark:border dark:border-neutral-600 relative"
>
  <div class="flex gap-3">
    <div>
      <img src="${item.logo}" alt="logo-image" class="w-20"/>
    </div>
    <div class="w-[91%]">
      <p class="text-[1.27rem] font-bold">${item.name}</p>
      <p class="text-[1rem] mt-1 text-left text-neutral-600 dark:text-neutral-300 w-[98%]">
        ${item.description}
      </p>
    </div>
  </div>

  <div class="mt-7 flex justify-between items-center">
    <div class="remove-btn absolute bottom-5">Remove</div>
    <div class="absolute bottom-5 right-5">
      <button
        class="js-toggle ${isActive ? "on-style" : "off-style"}"
        data-active="${isActive}"
        data-name="${item.name}"
      >
        <span class="js-thumb ${isActive ? "on-inner-circle" : "off-inner-circle"}"></span>
      </button>
    </div>
  </div>
</div>`;
}

// Renders the grid based on a filter: "all" | "active" | "inactive"
function renderData(filter = "all") {
  const filtered = data.filter((item) => {
    const isActive = getIsActive(item);
    if (filter === "active") return isActive;
    if (filter === "inactive") return !isActive;
    return true; // "all"
  });

  mainGrid.innerHTML = filtered.map(buildCard).join("");

  bindToggleListeners();

  if (filter === "active") {
    activeButton.classList.replace("unselected-btn", "selected-btn");
    allButton.classList.replace("selected-btn", "unselected-btn");
    inactiveButton.classList.replace("selected-btn", "unselected-btn");
  } else if (filter === "inactive") {
    inactiveButton.classList.replace("unselected-btn", "selected-btn");
    allButton.classList.replace("selected-btn", "unselected-btn");
    activeButton.classList.replace("selected-btn", "unselected-btn");
  } else if (filter === "all") {
    allButton.classList.replace("unselected-btn", "selected-btn");
    activeButton.classList.replace("selected-btn", "unselected-btn");
    inactiveButton.classList.replace("selected-btn", "unselected-btn");
  }
}

// Wires up click behavior for every toggle button currently in the DOM
function bindToggleListeners() {
  document.querySelectorAll(".js-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isActive = btn.dataset.active === "true";
      const thumb = btn.querySelector(".js-thumb");
      const newState = !isActive;

      if (newState) {
        btn.classList.remove("off-style");
        btn.classList.add("on-style");
        thumb.classList.remove("off-inner-circle");
        thumb.classList.add("on-inner-circle");
      } else {
        btn.classList.remove("on-style");
        btn.classList.add("off-style");
        thumb.classList.remove("on-inner-circle");
        thumb.classList.add("off-inner-circle");
      }

      btn.dataset.active = newState;

      const name = btn.dataset.name;
      savedStates[name] = newState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStates));
    });
  });
}

// Filter buttons
const allButton = document.querySelector(".js-all");
const activeButton = document.querySelector(".js-active");
const inactiveButton = document.querySelector(".js-inactive");

allButton.addEventListener("click", () => renderData("all"));
activeButton.addEventListener("click", () => renderData("active"));
inactiveButton.addEventListener("click", () => renderData("inactive"));

// --- Dark mode (unchanged) ---
let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector(".dark-mode-toggle");

const enableDarkMode = () => {
  document.documentElement.classList.add("dark");
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("darkMode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode();
} else {
  disableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// Initial render
renderData("all");
