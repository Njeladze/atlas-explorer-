const FAVORITES_KEY = "atlas_favorites";

const FLAG_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 213'><rect width='320' height='213' fill='%23e2e8ef'/><text x='50%25' y='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%231868b7' font-family='sans-serif'>?</text></svg>";

document.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initHeaderScroll();
  initScrollToTop();
  initCookieBanner();
  initScrollReveal();
});

function initBurgerMenu() {
  const burger = document.querySelector(".burger");
  const navList = document.querySelector(".nav-list");
  if (!burger || !navList) return;

  burger.addEventListener("click", function () {
    const isOpen = navList.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navList.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navList.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggleHeaderBg = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  toggleHeaderBg();
  window.addEventListener("scroll", toggleHeaderBg);
}

function initScrollToTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 500);
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCookieBanner() {
  const banner = document.querySelector(".cookie-banner");
  const acceptBtn = document.querySelector(".cookie-accept");
  if (!banner || !acceptBtn) return;

  const STORAGE_KEY = "atlas_cookies_accepted";

  if (localStorage.getItem(STORAGE_KEY) === "true") return;

  setTimeout(function () {
    banner.classList.add("show");
  }, 600);

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem(STORAGE_KEY, "true");
    banner.classList.remove("show");
  });
}

function initScrollReveal() {
  if (typeof ScrollReveal !== "function") return;

  const sr = ScrollReveal({
    distance: "30px",
    duration: 700,
    easing: "cubic-bezier(.5,0,0,1)",
    origin: "bottom",
    reset: false
  });

  sr.reveal(".reveal", { interval: 80 });
}


function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isFavorite(code) {
  return getFavorites().some(function (item) { return item.code === code; });
}

function toggleFavorite(country) {
  const favorites = getFavorites();
  const index = favorites.findIndex(function (item) { return item.code === country.code; });

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(country);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; 
}

function removeFavorite(code) {
  const favorites = getFavorites().filter(function (item) { return item.code !== code; });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function formatPopulation(num) {
  if (!num) return "—";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
}

function formatArea(num) {
  if (!num) return "—";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M km²";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K km²";
  return num + " km²";
}

function flagUrl(alpha2Code) {
  if (!alpha2Code) return FLAG_FALLBACK;
  return "https://flagcdn.com/w320/" + alpha2Code.toLowerCase() + ".png";
}
