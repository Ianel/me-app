(function () {
  "use strict";

  var PORTFOLIO_URL = "https://efabien.github.io/";
  var WHATSAPP_DISPLAY = "+261 34 76 013 43";
  var PHONE_DISPLAY = "+261 34 76 013 43";

  var STATES = {
    portfolio: {
      src: "qr.svg",
      alt: "QR code to efabien.github.io",
      hint: "efabien.github.io",
      mark: "FE"
    },
    github: {
      src: "qr-github.svg",
      alt: "QR code to github.com/Efabien",
      hint: "github.com/Efabien",
      mark: "GH"
    },
    linkedin: {
      src: "qr-linkedin.svg",
      alt: "QR code to linkedin.com/in/enone-fabien",
      hint: "linkedin.com/in/enone-fabien",
      mark: "in"
    },
    twitter: {
      src: "qr-twitter.svg",
      alt: "QR code to x.com/fabien_enone",
      hint: "x.com/fabien_enone",
      mark: "X"
    },
    whatsapp: {
      src: "qr-whatsapp.svg",
      alt: "QR code — WhatsApp " + WHATSAPP_DISPLAY,
      hint: "wa.me · " + WHATSAPP_DISPLAY,
      mark: "WA"
    },
    phone: {
      src: "qr-phone.svg",
      alt: "QR code — call " + PHONE_DISPLAY,
      hint: PHONE_DISPLAY,
      mark: "TEL"
    }
  };

  var card = document.getElementById("qr-card");
  var press = document.getElementById("qr-press");
  var img = document.getElementById("qr");
  var hintUrl = document.getElementById("qr-hint-url");
  var overlayMark = document.getElementById("qr-overlay-mark");

  function applyState(state) {
    if (!card) return;
    var s = STATES[state] || STATES.portfolio;
    card.dataset.state = STATES[state] ? state : "portfolio";
    img.src = s.src;
    img.alt = s.alt;
    hintUrl.textContent = s.hint;
    if (overlayMark) overlayMark.textContent = s.mark;
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
    setActive(next, true);
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

  /* ---------- qr dial scroller ---------- */
  var track = document.getElementById("qr-dial-track");
  var items = track
    ? Array.prototype.slice.call(track.querySelectorAll(".qr-dial-item"))
    : [];

  function findItem(target) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.target === target) return items[i];
    }
    return null;
  }

  function centerItem(el, smooth) {
    if (!track || !el) return;
    var trackRect = track.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    var delta =
      elRect.left + elRect.width / 2 - (trackRect.left + trackRect.width / 2);
    if (smooth && typeof track.scrollBy === "function") {
      track.scrollBy({ left: delta, behavior: "smooth" });
    } else {
      track.scrollLeft += delta;
    }
  }

  function updateProximity() {
    if (!track) return;
    var trackRect = track.getBoundingClientRect();
    var centerX = trackRect.left + trackRect.width / 2;
    var half = trackRect.width / 2 || 1;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - centerX) / half;
      var p = Math.max(0, 1 - d);
      items[i].style.setProperty("--p", p.toFixed(3));
    }
  }

  function nearestItem() {
    if (!track) return null;
    var trackRect = track.getBoundingClientRect();
    var centerX = trackRect.left + trackRect.width / 2;
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = items[i];
      }
    }
    return best;
  }

  function setActive(target, scrollToCenter) {
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var on = el.dataset.target === target;
      el.dataset.active = on ? "true" : "false";
      el.setAttribute("aria-selected", on ? "true" : "false");
      el.tabIndex = on ? 0 : -1;
    }
    applyState(target);
    if (scrollToCenter) centerItem(findItem(target), true);
  }

  if (track && items.length) {
    items.forEach(function (el) {
      el.addEventListener("click", function () {
        setActive(el.dataset.target, true);
      });
      el.addEventListener("keydown", function (e) {
        var idx = items.indexOf(el);
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          var next = items[Math.min(items.length - 1, idx + 1)];
          next.focus();
          setActive(next.dataset.target, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          var prev = items[Math.max(0, idx - 1)];
          prev.focus();
          setActive(prev.dataset.target, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          items[0].focus();
          setActive(items[0].dataset.target, true);
        } else if (e.key === "End") {
          e.preventDefault();
          var last = items[items.length - 1];
          last.focus();
          setActive(last.dataset.target, true);
        }
      });
    });

    var rafId = 0;
    var endTimer = 0;
    track.addEventListener(
      "scroll",
      function () {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateProximity);
        clearTimeout(endTimer);
        endTimer = setTimeout(function () {
          var el = nearestItem();
          if (el && el.dataset.target !== card.dataset.state) {
            setActive(el.dataset.target, false);
          }
        }, 110);
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      var active = findItem(card.dataset.state) || items[0];
      centerItem(active, false);
      updateProximity();
    });

    function initDial() {
      var initial = findItem(card.dataset.state) || items[0];
      centerItem(initial, false);
      setActive(initial.dataset.target, false);
      updateProximity();
    }

    if (document.readyState === "complete") {
      initDial();
    } else {
      window.addEventListener("load", initDial);
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
