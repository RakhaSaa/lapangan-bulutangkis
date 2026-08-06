"use strict";

const CONFIG = Object.freeze({
  whatsappNumber: "6282250763966",
  hourlyRate: 35000,
});

const elements = {
  menuToggle: document.getElementById("menu-toggle"),
  navigation: document.getElementById("primary-navigation"),
  bookingForm: document.getElementById("booking-form"),
  bookingDate: document.getElementById("booking-date"),
  bookingTime: document.getElementById("booking-time"),
  bookingDuration: document.getElementById("booking-duration"),
  bookingPlayers: document.getElementById("booking-players"),
  estimatedPrice: document.getElementById("estimated-price"),
  formMessage: document.getElementById("form-message"),
  currentYear: document.getElementById("current-year"),
};

initializePage();

function initializePage() {
  setMinimumBookingDate();
  updateEstimatedPrice();
  registerNavigationEvents();
  registerBookingEvents();
  updateCurrentYear();
}

function registerNavigationEvents() {
  if (!elements.menuToggle || !elements.navigation) {
    return;
  }

  elements.menuToggle.addEventListener("click", toggleNavigation);

  elements.navigation.addEventListener("click", function (event) {
    const link = event.target.closest("a");

    if (link) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      closeNavigation();
    }
  });
}

function registerBookingEvents() {
  if (!elements.bookingForm) {
    return;
  }

  elements.bookingDuration.addEventListener(
    "change",
    updateEstimatedPrice
  );

  elements.bookingForm.addEventListener(
    "submit",
    handleBookingSubmit
  );
}

function toggleNavigation() {
  const willOpen = !elements.navigation.classList.contains("open");

  elements.navigation.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  elements.menuToggle.setAttribute("aria-expanded", String(willOpen));
}

function closeNavigation() {
  if (!elements.navigation || !elements.menuToggle) {
    return;
  }

  elements.navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
  elements.menuToggle.setAttribute("aria-expanded", "false");
}

function setMinimumBookingDate() {
  if (!elements.bookingDate) {
    return;
  }

  const today = new Date();
  const minimumDate = formatDateForInput(today);

  elements.bookingDate.min = minimumDate;

  if (!elements.bookingDate.value) {
    elements.bookingDate.value = minimumDate;
  }
}

function updateEstimatedPrice() {
  const duration = Number(elements.bookingDuration?.value || 1);
  const total = CONFIG.hourlyRate * duration;

  if (elements.estimatedPrice) {
    elements.estimatedPrice.textContent = formatRupiah(total);
  }
}

function handleBookingSubmit(event) {
  event.preventDefault();
  clearFormMessage();

  const bookingDate = elements.bookingDate.value;
  const bookingTime = elements.bookingTime.value;
  const duration = Number(elements.bookingDuration.value || 1);
  const players = elements.bookingPlayers.value;

  if (!bookingDate) {
    showFormMessage("Pilih tanggal bermain terlebih dahulu.");
    elements.bookingDate.focus();
    return;
  }

  if (!bookingTime) {
    showFormMessage("Pilih jam mulai terlebih dahulu.");
    elements.bookingTime.focus();
    return;
  }

  if (isPastDate(bookingDate)) {
    showFormMessage("Tanggal bermain tidak boleh sebelum hari ini.");
    elements.bookingDate.focus();
    return;
  }

  const total = CONFIG.hourlyRate * duration;
  const formattedDate = formatIndonesianDate(bookingDate);

  const message = [
    "Halo kak, saya melihat website GOR MENTENG 6.",
    "Saya ingin mengecek ketersediaan lapangan dengan detail berikut:",
    "",
    `Tanggal: ${formattedDate}`,
    `Jam mulai: ${bookingTime}`,
    `Durasi: ${duration} jam`,
    `Jumlah pemain: ${players}`,
    `Perkiraan biaya: ${formatRupiah(total)}`,
    "",
    "Apakah lapangan masih tersedia?",
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

function showFormMessage(message) {
  if (elements.formMessage) {
    elements.formMessage.textContent = message;
  }
}

function clearFormMessage() {
  if (elements.formMessage) {
    elements.formMessage.textContent = "";
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatIndonesianDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isPastDate(dateKey) {
  const selected = new Date(`${dateKey}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selected < today;
}

function updateCurrentYear() {
  if (elements.currentYear) {
    elements.currentYear.textContent = String(new Date().getFullYear());
  }
}

/* ==========================================================
   CAROUSEL KEUNGGULAN HERO
   Aktif hanya pada layar HP (maksimal 640px).
   ========================================================== */

(function initializeBenefitCarousel() {
  const carousel = document.querySelector("[data-benefit-carousel]");

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector("[data-benefit-track]");
  const viewport = carousel.querySelector("[data-benefit-viewport]");
  const slides = Array.from(
    carousel.querySelectorAll("[data-benefit-slide]")
  );
  const dots = Array.from(
    carousel.querySelectorAll("[data-benefit-dot]")
  );
  const previousButton = carousel.querySelector("[data-benefit-prev]");
  const nextButton = carousel.querySelector("[data-benefit-next]");
  const status = carousel.querySelector("[data-benefit-status]");

  if (!track || !viewport || slides.length === 0) {
    return;
  }

  document.documentElement.classList.add("benefit-carousel-ready");

  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let timerId = null;
  let pointerStartX = null;

  function normalizeIndex(index) {
    return (index + slides.length) % slides.length;
  }

  function stopAutoSlide() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function scheduleAutoSlide() {
    stopAutoSlide();

    if (
      !mobileQuery.matches ||
      reducedMotionQuery.matches ||
      document.hidden
    ) {
      return;
    }

    timerId = window.setTimeout(function () {
      showSlide(currentIndex + 1, false);
      scheduleAutoSlide();
    }, 4500);
  }

  function updateAccessibility() {
    slides.forEach(function (slide, index) {
      const isCurrent = index === currentIndex;

      slide.classList.toggle("is-active", isCurrent);
      slide.setAttribute(
        "aria-hidden",
        mobileQuery.matches && !isCurrent ? "true" : "false"
      );
    });

    dots.forEach(function (dot, index) {
      const isCurrent = index === currentIndex;

      dot.classList.toggle("is-active", isCurrent);
      dot.setAttribute("aria-current", isCurrent ? "true" : "false");
    });

    if (status && mobileQuery.matches) {
      const title = slides[currentIndex].querySelector("strong")?.textContent;
      status.textContent = `Keunggulan ${currentIndex + 1} dari ${slides.length}: ${title || ""}`;
    }
  }

  function showSlide(index, restartTimer = true) {
    currentIndex = normalizeIndex(index);

    if (mobileQuery.matches) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      track.style.transform = "";
    }

    updateAccessibility();

    if (restartTimer) {
      scheduleAutoSlide();
    }
  }

  previousButton?.addEventListener("click", function () {
    showSlide(currentIndex - 1);
  });

  nextButton?.addEventListener("click", function () {
    showSlide(currentIndex + 1);
  });

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  viewport.addEventListener("pointerdown", function (event) {
    if (!mobileQuery.matches || !event.isPrimary) {
      return;
    }

    pointerStartX = event.clientX;
  });

  viewport.addEventListener("pointerup", function (event) {
    if (pointerStartX === null || !mobileQuery.matches) {
      return;
    }

    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) < 45) {
      return;
    }

    showSlide(distance < 0 ? currentIndex + 1 : currentIndex - 1);
  });

  viewport.addEventListener("pointercancel", function () {
    pointerStartX = null;
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      scheduleAutoSlide();
    }
  });

  function handleResponsiveChange() {
    showSlide(currentIndex, false);
    scheduleAutoSlide();
  }

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", handleResponsiveChange);
    reducedMotionQuery.addEventListener("change", handleResponsiveChange);
  } else {
    mobileQuery.addListener(handleResponsiveChange);
    reducedMotionQuery.addListener(handleResponsiveChange);
  }

  showSlide(0, false);
  scheduleAutoSlide();
})();
