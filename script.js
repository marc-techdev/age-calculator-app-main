const form = document.getElementById("age-form");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

const resultYears = document.getElementById("result-years");
const resultMonths = document.getElementById("result-months");
const resultDays = document.getElementById("result-days");

const inputs = {
  day: dayInput,
  month: monthInput,
  year: yearInput,
};

const labels = {
  day: document.getElementById("label-day"),
  month: document.getElementById("label-month"),
  year: document.getElementById("label-year"),
};

const errors = {
  day: document.getElementById("error-day"),
  month: document.getElementById("error-month"),
  year: document.getElementById("error-year"),
};

function setError(field, message) {
  inputs[field].classList.add("border-red-400", "caret-red-400");
  inputs[field].classList.remove(
    "border-grey-200",
    "focus:border-purple-500",
    "focus:caret-purple-500",
  );
  labels[field].classList.add("text-red-400");
  labels[field].classList.remove("text-grey-500");
  errors[field].textContent = message;
  errors[field].classList.remove("hidden");
}

function clearError(field) {
  inputs[field].classList.remove("border-red-400", "caret-red-400");
  inputs[field].classList.add(
    "border-grey-200",
    "focus:border-purple-500",
    "focus:caret-purple-500",
  );
  labels[field].classList.remove("text-red-400");
  labels[field].classList.add("text-grey-500");
  errors[field].textContent = "";
  errors[field].classList.add("hidden");
}

function clearAllErrors() {
  clearError("day");
  clearError("month");
  clearError("year");
}

function validateInput(day, month, year) {
  let isValid = true;
  const currentYear = new Date().getFullYear();
  const currentDate = new Date(); // To check future full date

  // Required checks
  if (!day) {
    setError("day", "This field is required");
    isValid = false;
  }
  if (!month) {
    setError("month", "This field is required");
    isValid = false;
  }
  if (!year) {
    setError("year", "This field is required");
    isValid = false;
  }

  if (!isValid) return false;

  // Value ranges
  if (day < 1 || day > 31) {
    setError("day", "Must be a valid day");
    isValid = false;
  }
  if (month < 1 || month > 12) {
    setError("month", "Must be a valid month");
    isValid = false;
  }
  if (year > currentYear) {
    setError("year", "Must be in the past");
    isValid = false;
  }

  if (!isValid) return false;

  // Date validity (e.g., 31/04)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    setError("day", "Must be a valid date");
    isValid = false;
  }

  if (date > currentDate) {
    setError("year", "Must be in the past");
    isValid = false;
  }

  return isValid;
}

function calculateAge(day, month, year) {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  clearAllErrors();

  const day = dayInput.value;
  const month = monthInput.value;
  const year = yearInput.value;

  if (validateInput(day, month, year)) {
    const age = calculateAge(day, month, year);

    animateValue(resultYears, 0, age.years, 500);
    animateValue(resultMonths, 0, age.months, 500);
    animateValue(resultDays, 0, age.days, 500);
  } else {
    resultYears.textContent = "--";
    resultMonths.textContent = "--";
    resultDays.textContent = "--";
  }
});
