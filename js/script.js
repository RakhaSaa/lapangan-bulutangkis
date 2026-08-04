"use strict";

/*
 * GOR MENTENG 6
 * File: js/script.js
 *
 * Fungsi:
 * 1. Mengaktifkan menu navigasi seluler.
 * 2. Menutup menu setelah tautan dipilih.
 * 3. Menutup menu dengan tombol Escape.
 * 4. Memperbarui tahun hak cipta secara otomatis.
 */

// Memberi tahu CSS bahwa JavaScript berhasil dijalankan.
document.documentElement.classList.add("js-enabled");

const menuToggle = document.getElementById("menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");
const currentYear = document.getElementById("current-year");

const mobileScreen = window.matchMedia("(max-width: 47.99rem)");

/*
 * Memperbarui tahun pada footer.
 * Contoh: 2026 akan berubah otomatis mengikuti tahun saat ini.
 */
if (currentYear) {
  currentYear.textContent = new Date().getFullYear().toString();
}

/*
 * Menu hanya dijalankan jika tombol dan navigasi ditemukan.
 * Pemeriksaan ini mencegah error apabila salah satu elemen tidak tersedia.
 */
if (menuToggle && primaryNavigation) {
  const menuIcon = menuToggle.querySelector('[aria-hidden="true"]');
  const menuText = menuToggle.querySelector(".menu-text");

  /*
   * Atribut hidden dihapus setelah JavaScript berhasil dijalankan.
   * Dengan demikian, tombol tidak muncul jika JavaScript gagal dimuat.
   */
  menuToggle.hidden = false;

  /**
   * Mengatur keadaan menu.
   *
   * @param {boolean} isOpen - true untuk membuka, false untuk menutup.
   */
  const setMenuState = (isOpen) => {
    primaryNavigation.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      isOpen.toString()
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Tutup menu navigasi"
        : "Buka menu navigasi"
    );

    if (menuIcon) {
      menuIcon.textContent = isOpen ? "✕" : "☰";
    }

    if (menuText) {
      menuText.textContent = isOpen ? "Tutup" : "Menu";
    }
  };

  // Menu dimulai dalam keadaan tertutup.
  setMenuState(false);

  // Membuka atau menutup menu saat tombol ditekan.
  menuToggle.addEventListener("click", () => {
    const isCurrentlyOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuState(!isCurrentlyOpen);
  });

  /*
   * Menutup navigasi setelah pengunjung memilih salah satu tautan
   * pada tampilan ponsel.
   */
  const navigationLinks =
    primaryNavigation.querySelectorAll("a");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileScreen.matches) {
        setMenuState(false);
      }
    });
  });

  // Menutup menu saat tombol Escape ditekan.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  /*
   * Mengembalikan menu ke keadaan tertutup ketika ukuran layar
   * berubah dari ponsel menjadi desktop atau sebaliknya.
   */
  const handleScreenChange = () => {
    setMenuState(false);
  };

  if (typeof mobileScreen.addEventListener === "function") {
    mobileScreen.addEventListener(
      "change",
      handleScreenChange
    );
  } else {
    /*
     * Dukungan untuk browser lama.
     * addListener tidak digunakan pada browser modern.
     */
    mobileScreen.addListener(handleScreenChange);
  }
}