const COUNTRIES_API =
  "https://countries.dev/countries?fields=name,capital,region,population,area,alpha2Code,alpha3Code";

let allCountries = [];
let activeRegion = "all";
let activeQuery = "";
let activeSort = "name-asc";

const gridEl = document.getElementById("countryGrid");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const sortSelect = document.getElementById("sortSelect");
const resultsMeta = document.getElementById("resultsMeta");

document.addEventListener("DOMContentLoaded", function () {
  if (gridEl) loadCountries();
});

async function loadCountries() {
  gridEl.innerHTML = '<div class="spinner-row"><div class="spinner"></div></div>';

  try {
    const response = await fetch(COUNTRIES_API);
    if (!response.ok) throw new Error("Server error: " + response.status);
    const data = await response.json();

    allCountries = data.map(function (c) {
      return {
        code: c.alpha3Code,
        name: c.name || "Unknown",
        capital: c.capital || "—",
        region: c.region || "Other",
        population: c.population || 0,
        area: c.area || 0,
        flag: flagUrl(c.alpha2Code)
      };
    });

    renderGrid();
  } catch (error) {
    gridEl.innerHTML = '<p class="empty-state">ქვეყნების ჩატვირთვა ვერ მოხერხდა. სცადეთ გვერდის განახლება.</p>';
    console.error("countries.dev fetch failed:", error);
  }
}

function renderGrid() {
  const filtered = allCountries.filter(function (c) {
    const regionMatch = activeRegion === "all" || c.region === activeRegion;
    const queryMatch =
      !activeQuery ||
      c.name.toLowerCase().includes(activeQuery) ||
      c.capital.toLowerCase().includes(activeQuery);
    return regionMatch && queryMatch;
  });

  sortCountries(filtered);

  if (filtered.length === 0) {
    gridEl.innerHTML = '<p class="empty-state">ვერაფერი მოიძებნა 🌍 სცადეთ სხვა საძიებო სიტყვა ან რეგიონი.</p>';
  } else {
    gridEl.innerHTML = filtered.map(cardTemplate).join("");
    attachCardEvents();
  }

  if (resultsMeta) {
    resultsMeta.textContent = filtered.length + " ქვეყანა ნაპოვნია " + allCountries.length + "-დან";
  }
}

function sortCountries(list) {
  switch (activeSort) {
    case "population-desc":
      list.sort(function (a, b) { return b.population - a.population; });
      break;
    case "population-asc":
      list.sort(function (a, b) { return a.population - b.population; });
      break;
    case "area-desc":
      list.sort(function (a, b) { return b.area - a.area; });
      break;
    case "area-asc":
      list.sort(function (a, b) { return a.area - b.area; });
      break;
    default:
      list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }
  return list;
}

function cardTemplate(country) {
  const active = isFavorite(country.code) ? "is-active" : "";
  const heart = isFavorite(country.code) ? "❤️" : "🤍";

  return (
    '<article class="country-card reveal" data-code="' + country.code + '">' +
      '<div class="card-flag">' +
        '<img src="' + country.flag + '" alt="' + country.name + ' flag" loading="lazy" onerror="this.onerror=null;this.src=\'' + FLAG_FALLBACK + '\';" />' +
        '<button class="fav-btn ' + active + '" data-code="' + country.code + '" aria-label="დაამატე favorites-ში">' + heart + '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<span class="region-badge">' + country.region + '</span>' +
        '<h3>' + country.name + '</h3>' +
        '<div class="card-meta">' +
          '<span>📍 ' + country.capital + '</span>' +
          '<span>👥 ' + formatPopulation(country.population) + '</span>' +
          '<span>📐 ' + formatArea(country.area) + '</span>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function attachCardEvents() {
  gridEl.querySelectorAll(".country-card").forEach(function (card) {
    card.addEventListener("click", function () {
      window.location.href = "country.html?code=" + card.dataset.code;
    });
  });

  gridEl.querySelectorAll(".fav-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const country = allCountries.find(function (c) { return c.code === btn.dataset.code; });
      const added = toggleFavorite(country);
      btn.classList.toggle("is-active", added);
      btn.textContent = added ? "❤️" : "🤍";
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    activeQuery = searchInput.value.trim().toLowerCase();
    renderGrid();
  });
}

if (regionSelect) {
  regionSelect.addEventListener("change", function () {
    activeRegion = regionSelect.value;
    renderGrid();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    activeSort = sortSelect.value;
    renderGrid();
  });
}
