(function () {
  "use strict";

  /* ---------- institutions autocomplete ---------- */
  var ISRAELI_INSTITUTIONS = [
    "אוניברסיטת תל אביב",
    "האוניברסיטה העברית בירושלים",
    "הטכניון – מכון טכנולוגי לישראל",
    "אוניברסיטת בר-אילן",
    "אוניברסיטת חיפה",
    "אוניברסיטת בן-גוריון בנגב",
    "אוניברסיטת אריאל",
    "האוניברסיטה הפתוחה",
    "אוניברסיטת רייכמן (המרכז הבינתחומי הרצליה)",
    "מכון ויצמן למדע",
    "המכללה האקדמית תל אביב-יפו",
    "המכללה האקדמית נתניה",
    "המכללה האקדמית אשקלון",
    "המכללה האקדמית כנרת",
    "המכללה האקדמית עמק יזרעאל",
    "המכללה האקדמית ספיר",
    "המכללה האקדמית אחוה",
    "המכללה האקדמית תל-חי",
    "המכללה האקדמית רופין",
    "המכללה האקדמית להנדסה אורט בראודה",
    "המכללה האקדמית להנדסה סמי שמעון (SCE)",
    "מכללת אפקה להנדסה",
    "המכללה האקדמית להנדסה אזרעלי ירושלים",
    "המכללה האקדמית הדסה",
    "מכללת שנקר – הנדסה, עיצוב ואמנות",
    "בצלאל – אקדמיה לאמנות ועיצוב ירושלים",
    "סמינר הקיבוצים – המכללה לחינוך, לטכנולוגיה ולאמנויות",
    "מכללת אורות ישראל",
    "מכללת אורנים",
    "מכללת בית ברל",
    "מכללת גורדון",
    "המכללה האקדמית לחינוך ע\"ש קיי",
    "מכללת לוינסקי-וינגייט לחינוך",
    "מכללת תלפיות",
    "מכללת שאנן",
    "מכון לב – המכללה הטכנולוגית ירושלים (JCT)",
    "הקריה האקדמית אונו",
    "המכללה האקדמית כרמל",
    "מכללת ויצו חיפה",
    "מכללת דן קיסריה",
    "המכללה האקדמית אשכול"
  ];

  var institutionsList = document.getElementById("institutions-list");
  if (institutionsList) {
    ISRAELI_INSTITUTIONS.forEach(function (name) {
      var opt = document.createElement("option");
      opt.value = name;
      institutionsList.appendChild(opt);
    });
  }

  /* ---------- ambient stars ---------- */
  var starsWrap = document.getElementById("stars");
  var STAR_COUNT = 46;
  for (var i = 0; i < STAR_COUNT; i++) {
    var s = document.createElement("span");
    s.style.top = Math.random() * 100 + "%";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 5).toFixed(2) + "s";
    s.style.animationDuration = (3.5 + Math.random() * 3).toFixed(2) + "s";
    starsWrap.appendChild(s);
  }

  /* ---------- stage config ---------- */
  var STAGE_LABELS = ["פרטים", "סיוע", "לימודים", "רקע", "כלכלי", "שירות"];
  var stages = Array.prototype.slice.call(document.querySelectorAll(".stage"));
  var totalStages = stages.length;
  var current = 1;

  var screenIntro = document.getElementById("screen-intro");
  var screenSuccess = document.getElementById("screen-success");
  var quizForm = document.getElementById("quiz");
  var progressEl = document.getElementById("progress");
  var progressFill = document.getElementById("progressFill");
  var btnStart = document.getElementById("btn-start");
  var btnBack = document.getElementById("btn-back");
  var btnNext = document.getElementById("btn-next");
  var btnSubmit = document.getElementById("btn-submit");
  var errorBanner = document.getElementById("errorBanner");

  /* build progress dots */
  STAGE_LABELS.forEach(function (label, idx) {
    var dot = document.createElement("div");
    dot.className = "step-dot";
    dot.dataset.stage = idx + 1;
    dot.innerHTML = '<div class="dot"></div><div class="label">' + label + "</div>";
    progressEl.appendChild(dot);
  });

  function renderProgress() {
    var pct = ((current - 1) / (totalStages - 1)) * 100;
    progressFill.style.width = pct + "%";
    document.querySelectorAll(".step-dot").forEach(function (dot) {
      var n = parseInt(dot.dataset.stage, 10);
      dot.classList.toggle("active", n === current);
      dot.classList.toggle("done", n < current);
    });
  }

  function showStage(n) {
    stages.forEach(function (st) {
      st.hidden = parseInt(st.dataset.stage, 10) !== n;
    });
    btnBack.style.display = n === 1 ? "none" : "inline-block";
    btnNext.style.display = n === totalStages ? "none" : "inline-block";
    btnSubmit.style.display = n === totalStages ? "inline-block" : "none";
    renderProgress();
    window.scrollTo({ top: quizForm.offsetTop - 20, behavior: "smooth" });
  }

  btnStart.addEventListener("click", function () {
    screenIntro.style.display = "none";
    quizForm.style.display = "block";
    showStage(1);
  });

  btnNext.addEventListener("click", function () {
    if (!validateStage(current)) return;
    if (current < totalStages) {
      current++;
      showStage(current);
    }
  });

  btnBack.addEventListener("click", function () {
    if (current > 1) {
      current--;
      showStage(current);
    }
  });

  /* ---------- required-field validation per stage ---------- */
  function validateStage(n) {
    var stage = stages[n - 1];
    var required = stage.querySelectorAll("[required]");
    for (var i = 0; i < required.length; i++) {
      var el = required[i];
      if (el.type === "checkbox") {
        if (!el.checked) { el.focus(); return false; }
      } else if (!el.value.trim()) {
        el.focus();
        el.style.borderColor = "var(--danger)";
        return false;
      }
    }
    return true;
  }

  /* ---------- option chip visual state (checked class) ---------- */
  document.querySelectorAll(".opt input").forEach(function (input) {
    input.addEventListener("change", function () {
      var group = document.querySelectorAll('input[name="' + input.name + '"]');
      group.forEach(function (g) {
        var label = g.closest(".opt");
        if (!label) return;
        label.classList.toggle("checked", g.checked);
      });
      applyConditionals();
    });
  });

  /* ---------- conditional fields (show/hide based on another field's value) ---------- */
  var conditionals = Array.prototype.slice.call(document.querySelectorAll(".conditional"));
  function applyConditionals() {
    conditionals.forEach(function (block) {
      var rule = block.dataset.showWhen; // e.g. "housing=בדירה שכורה"
      var parts = rule.split("=");
      var fieldName = parts[0];
      var expected = parts[1];
      var selected = document.querySelector('input[name="' + fieldName + '"]:checked');
      var show = selected && selected.value === expected;
      block.classList.toggle("show", !!show);
    });
  }
  applyConditionals();

  /* ---------- gather form data ---------- */
  function collectData() {
    var data = {};
    var formEls = quizForm.querySelectorAll("input, textarea");
    formEls.forEach(function (el) {
      if (!el.name) return;
      if (el.type === "checkbox") {
        if (el.name === "consent") {
          data.consent = el.checked ? "כן" : "לא";
          return;
        }
        if (!el.checked) return;
        data[el.name] = data[el.name] ? data[el.name] + ", " + el.value : el.value;
      } else if (el.type === "radio") {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value.trim();
      }
    });
    data.submitted_at = new Date().toISOString();
    data.source = "AcadeMe.Fund";
    return data;
  }

  /* ---------- submit ---------- */
  quizForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStage(current)) return;

    var data = collectData();
    var url = (window.ACADEME_CONFIG && window.ACADEME_CONFIG.GOOGLE_SCRIPT_URL) || "";
    errorBanner.classList.remove("show");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "שולח...";

    if (!url || url.indexOf("PASTE_YOUR_DEPLOYMENT_ID_HERE") !== -1) {
      console.warn("AcadeMe.Fund: GOOGLE_SCRIPT_URL is not configured yet. Payload:", data);
      finishSuccess(data);
      return;
    }

    fetch(url, {
      method: "POST",
      mode: "no-cors", // Apps Script web apps don't return CORS headers; we can't read the response,
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // text/plain avoids a CORS preflight
      body: JSON.stringify(data)
    })
      .then(function () {
        finishSuccess(data);
      })
      .catch(function (err) {
        console.error("AcadeMe.Fund submit error:", err);
        errorBanner.classList.add("show");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "שליחת השאלון ✦";
      });
  });

  function finishSuccess(data) {
    document.getElementById("successName").textContent = data.full_name || "";
    quizForm.style.display = "none";
    screenSuccess.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
})();
