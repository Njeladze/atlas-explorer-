const params = new URLSearchParams(window.location.search);
const countryCode = params.get("code");

const heroRoot = document.getElementById("detailHero");
const errorBox = document.getElementById("errorBox");

document.addEventListener("DOMContentLoaded", function () {
  if (!heroRoot) return;

  if (!countryCode) {
    showError("No country was specified.");
    return;
  }

  loadCountry(countryCode);
});

async function loadCountry(code) {
  try {
    const response = await fetch("https://countries.dev/alpha/" + code + "?full=true");
    if (!response.ok) throw new Error("Country not found");
    const country = await response.json();
    renderCountry(country);
  } catch (error) {
    showError("Could not load this country's data.");
    console.error("countries.dev fetch failed:", error);
  }
}

function renderCountry(c) {
  document.title = c.name + " — Atlas Explorer";

  document.getElementById("heroFlag").src = flagUrl(c.alpha2Code);
  document.getElementById("heroFlag").alt = c.name + " flag";
  document.getElementById("heroRegion").textContent = c.subregion || c.region;
  document.getElementById("heroName").textContent = c.name;
  document.getElementById("heroNative").textContent = c.nativeName || "";

  const languages = (c.languages || []).map(function (l) { return l.name; }).join(", ") || "—";
  const currencies = (c.currencies || []).map(function (cur) { return cur.name + (cur.symbol ? " (" + cur.symbol + ")" : ""); }).join(", ") || "—";

  document.getElementById("blurb").textContent =
    c.name + " is located in " + (c.subregion || c.region) + ", with " + (c.capital || "its capital") +
    " as its capital city. Here are the key facts about this nation.";

  document.getElementById("tagRegion").textContent = c.region;
  if (c.demonym) {
    document.getElementById("tagDemonym").textContent = c.demonym + " people";
    document.getElementById("tagDemonym").hidden = false;
  }

  const mapsLink = document.getElementById("mapsLink");
  mapsLink.href = c.maps && c.maps.googleMaps
    ? c.maps.googleMaps
    : "https://www.google.com/maps/search/" + encodeURIComponent(c.name);

  const stats = [
    ["👥", "Population", c.population ? c.population.toLocaleString() : "—"],
    ["🏛️", "Capital", c.capital || "—"],
    ["📐", "Area", c.area ? c.area.toLocaleString() + " km²" : "—"],
    ["🗣️", "Languages", languages],
    ["💰", "Currency", currencies],
    ["🕒", "Timezone", (c.timezones && c.timezones[0]) || "—"]
  ];

  document.getElementById("statsGrid").innerHTML = stats.map(function (s) {
    return (
      '<div class="stat-card">' +
        '<div class="icon">' + s[0] + '</div>' +
        '<span class="label">' + s[1] + '</span>' +
        '<span class="value">' + s[2] + '</span>' +
      '</div>'
    );
  }).join("");

  setupFavoriteButton(c);

  heroRoot.hidden = false;
}

function setupFavoriteButton(c) {
  const btn = document.getElementById("favBtn");
  if (!btn) return;

  const minimalCountry = {
    code: c.alpha3Code,
    name: c.name,
    capital: c.capital || "—",
    region: c.region,
    population: c.population,
    flag: flagUrl(c.alpha2Code)
  };

  updateFavButton(btn, isFavorite(c.alpha3Code));

  btn.addEventListener("click", function () {
    const added = toggleFavorite(minimalCountry);
    updateFavButton(btn, added);
  });
}

function updateFavButton(btn, active) {
  btn.classList.toggle("is-active", active);
  btn.textContent = active ? "❤️" : "🤍";
}

function showError(message) {
  heroRoot.hidden = true;
  document.getElementById("statsGrid").innerHTML = "";
  errorBox.hidden = false;
  document.getElementById("errorMsg").textContent = message;
}
