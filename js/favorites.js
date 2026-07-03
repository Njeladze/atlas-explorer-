document.addEventListener("DOMContentLoaded", renderFavorites);

function renderFavorites() {
  const grid = document.getElementById("favGrid");
  const emptyState = document.getElementById("emptyState");
  const counter = document.getElementById("favCount");
  if (!grid) return;

  const favorites = getFavorites();
  if (counter) counter.textContent = favorites.length + " saved countries";

  if (favorites.length === 0) {
    grid.hidden = true;
    emptyState.hidden = false;
    return;
  }

  grid.hidden = false;
  emptyState.hidden = true;

  grid.innerHTML = favorites.map(function (country) {
    return (
      '<article class="country-card reveal" data-code="' + country.code + '">' +
        '<div class="card-flag">' +
          '<img src="' + country.flag + '" alt="' + country.name + ' flag" loading="lazy" onerror="this.onerror=null;this.src=\'' + FLAG_FALLBACK + '\';" />' +
          '<button class="fav-btn is-active fav-remove" data-code="' + country.code + '" aria-label="Remove from favorites">❤️</button>' +
        '</div>' +
        '<div class="card-body">' +
          '<span class="region-badge">' + country.region + '</span>' +
          '<h3>' + country.name + '</h3>' +
          '<div class="card-meta">' +
            '<span>📍 ' + country.capital + '</span>' +
            '<span>👥 ' + formatPopulation(country.population) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }).join("");

  grid.querySelectorAll(".country-card").forEach(function (card) {
    card.addEventListener("click", function () {
      window.location.href = "country.html?code=" + card.dataset.code;
    });
  });

  grid.querySelectorAll(".fav-remove").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      removeFavorite(btn.dataset.code);
      renderFavorites();
    });
  });
}
