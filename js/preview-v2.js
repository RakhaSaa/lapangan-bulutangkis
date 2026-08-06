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
   CAROUSEL KEUNGGULAN
   - Berganti otomatis setiap 4,5 detik pada layar HP
   - Dapat dikontrol dengan tombol panah dan indikator
   - Pada desktop, ketiga kartu tampil bersamaan
   ========================================================== */

(() => {
  document.documentElement.classList.add("js-enabled");

  const slider = document.querySelector("[data-benefit-slider]");

  if (!slider) {
    return;
  }

  const track = slider.querySelector("[data-benefit-track]");
  const slides = Array.from(
    slider.querySelectorAll("[data-benefit-slide]")
  );
  const dots = Array.from(
    slider.querySelectorAll("[data-benefit-dot]")
  );
  const previousButton = slider.querySelector("[data-benefit-prev]");
  const nextButton = slider.querySelector("[data-benefit-next]");

  if (
    !track ||
    slides.length === 0 ||
    dots.length !== slides.length
  ) {
    return;
  }

  const mobileScreen = window.matchMedia("(max-width: 47.99rem)");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentSlide = 0;
  let autoSlideTimer = null;

  /**
   * Menghentikan perpindahan otomatis.
   */
  const stopAutoSlide = () => {
    if (autoSlideTimer !== null) {
      window.clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  };

  /**
   * Memulai perpindahan otomatis hanya pada layar HP.
   */
  const startAutoSlide = () => {
    stopAutoSlide();

    if (
      !mobileScreen.matches ||
      reducedMotion.matches ||
      slider.matches(":hover") ||
      slider.contains(document.activeElement) ||
      document.hidden
    ) {
      return;
    }

    autoSlideTimer = window.setInterval(() => {
      showSlide(currentSlide + 1, false);
    }, 4500);
  };

  /**
   * Menampilkan slide berdasarkan nomor urutan.
   *
   * @param {number} requestedSlide Nomor slide yang ingin ditampilkan.
   * @param {boolean} restartTimer Apakah timer perlu dimulai ulang.
   */
  const showSlide = (requestedSlide, restartTimer = true) => {
    currentSlide =
      (requestedSlide + slides.length) % slides.length;

    if (mobileScreen.matches) {
      track.style.transform =
        `translateX(-${currentSlide * 100}%)`;
    } else {
      track.style.transform = "";
    }

    slides.forEach((slide, index) => {
      const isCurrentSlide = index === currentSlide;

      slide.classList.toggle("is-active", isCurrentSlide);

      slide.setAttribute(
        "aria-hidden",
        mobileScreen.matches && !isCurrentSlide
          ? "true"
          : "false"
      );
    });

    dots.forEach((dot, index) => {
      const isCurrentDot = index === currentSlide;

      dot.classList.toggle("is-active", isCurrentDot);

      dot.setAttribute(
        "aria-current",
        isCurrentDot ? "true" : "false"
      );
    });

    if (restartTimer) {
      startAutoSlide();
    }
  };

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      showSlide(currentSlide - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showSlide(currentSlide + 1);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
  slider.addEventListener("focusin", stopAutoSlide);

  slider.addEventListener("focusout", (event) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !slider.contains(event.relatedTarget)
    ) {
      startAutoSlide();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  const handleScreenChange = () => {
    showSlide(currentSlide, false);
    startAutoSlide();
  };

  if (typeof mobileScreen.addEventListener === "function") {
    mobileScreen.addEventListener("change", handleScreenChange);
    reducedMotion.addEventListener("change", handleScreenChange);
  } else {
    mobileScreen.addListener(handleScreenChange);
    reducedMotion.addListener(handleScreenChange);
  }

  showSlide(0, false);
  startAutoSlide();
})();
