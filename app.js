(function () {
  "use strict";

  var PORTFOLIO_URL = "https://efabien.github.io/";
  var PHONE_DISPLAY = "+261 34 76 013 43";

  var card = document.getElementById("qr-card");
  var press = document.getElementById("qr-press");
  var img = document.getElementById("qr");
  var hintUrl = document.getElementById("qr-hint-url");
  var overlayMark = document.getElementById("qr-overlay-mark");

  function applyState(state) {
    if (!card) return;
    card.dataset.state = state;
    if (state === "phone") {
      img.src = "qr-phone.svg";
      img.alt = "QR code — call " + PHONE_DISPLAY;
      hintUrl.textContent = PHONE_DISPLAY;
      if (overlayMark) overlayMark.textContent = "TEL";
    } else {
      img.src = "qr.svg";
      img.alt = "QR code to efabien.github.io";
      hintUrl.textContent = "efabien.github.io";
      if (overlayMark) overlayMark.textContent = "FE";
    }
  }

  /* ---------- long-press ---------- */
  var HOLD_MS = 450;
  var MOVE_THRESH = 8;
  var holdTimer = null;
  var holdStart = null;

  function clearHold() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (press) press.classList.remove("is-holding");
    holdStart = null;
  }

  function fireToggle() {
    var next = card.dataset.state === "phone" ? "portfolio" : "phone";
    applyState(next);
    if (navigator.vibrate) {
      try {
        navigator.vibrate(22);
      } catch (_) {}
    }
  }

  if (press) {
    press.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (press.setPointerCapture) {
        try {
          press.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
      holdStart = { x: e.clientX || 0, y: e.clientY || 0 };
      press.classList.add("is-holding");
      holdTimer = setTimeout(function () {
        fireToggle();
        holdTimer = null;
        press.classList.remove("is-holding");
      }, HOLD_MS);
    });

    press.addEventListener("pointerup", clearHold);
    press.addEventListener("pointercancel", clearHold);
    press.addEventListener("pointerleave", clearHold);

    press.addEventListener("pointermove", function (e) {
      if (!holdStart) return;
      var dx = (e.clientX || 0) - holdStart.x;
      var dy = (e.clientY || 0) - holdStart.y;
      if (Math.hypot(dx, dy) > MOVE_THRESH) clearHold();
    });

    press.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    press.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    press.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        fireToggle();
      }
    });
  }

  /* ---------- share ---------- */
  var shareBtn = document.getElementById("share");
  var shareLabel = document.getElementById("share-label");
  if (shareBtn) {
    shareBtn.addEventListener("click", async function () {
      var shareData = {
        title: "Fabien Enone",
        text: "Fabien Enone — web solution engineer",
        url: PORTFOLIO_URL
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(PORTFOLIO_URL);
          shareBtn.classList.add("is-copied");
          shareLabel.textContent = "Link copied ✓";
          setTimeout(function () {
            shareBtn.classList.remove("is-copied");
            shareLabel.textContent = "Share card";
          }, 1800);
          return;
        }
      } catch (_) {
        /* user cancelled or clipboard blocked */
      }
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
