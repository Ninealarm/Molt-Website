const artworks = [
  {
    id: 1,
    title: "Flame Hashira — Layered Acrylic Glow",
    artist: "@kaze_ink_studio",
    approach: "Traditional",
    form: "Anime",
    medium: "Acrylic",
    baseInr: 1800,
    slotsLeft: "1 of 3 Slots Open",
    height: 260,
    palette: ["#ff4e00", "#ff9e00", "#1b0c02"],
    crafts: { palette: 42, linework: 31 }
  },
  {
    id: 2,
    title: "Sahyadri Harvest — Sacred Warli Mural",
    artist: "@tara_warli_craft",
    approach: "Traditional",
    form: "Warli",
    medium: "Acrylic",
    baseInr: 2400,
    slotsLeft: "2 of 4 Slots Open",
    height: 220,
    palette: ["#9c4100", "#f4ebd9", "#2b1100"],
    crafts: { palette: 29, linework: 54 }
  },
  {
    id: 3,
    title: "Mithila Lotus & Peacock Mandala",
    artist: "@vaidehi_folk_art",
    approach: "Traditional",
    form: "Madhubani",
    medium: "Watercolor",
    baseInr: 3200,
    slotsLeft: "1 of 2 Slots Open",
    height: 280,
    palette: ["#e63946", "#ffb703", "#1d3557"],
    crafts: { palette: 64, linework: 71 }
  },
  {
    id: 4,
    title: "Shonen Action Frame — Marker Blend",
    artist: "@zen_marker_works",
    approach: "Traditional",
    form: "Anime",
    medium: "Alcohol Markers",
    baseInr: 1500,
    slotsLeft: "3 of 3 Slots Open",
    height: 230,
    palette: ["#f72585", "#4cc9f0", "#240046"],
    crafts: { palette: 38, linework: 49 }
  },
  {
    id: 5,
    title: "Chiaroscuro Portrait Study",
    artist: "@aravind_finearts",
    approach: "Traditional",
    form: "Realism",
    medium: "Charcoal",
    baseInr: 2100,
    slotsLeft: "Waitlist Only",
    height: 270,
    palette: ["#334155", "#94a3b8", "#0f172a"],
    crafts: { palette: 19, linework: 63 }
  },
  {
    id: 6,
    title: "Neon Ronin — Character Sheet",
    artist: "@ryu_character_lab",
    approach: "Digital",
    form: "Concept",
    medium: "Digital Brush",
    baseInr: 2800,
    slotsLeft: "2 of 2 Slots Open",
    height: 240,
    palette: ["#00f5d4", "#7b2cbf", "#10002b"],
    crafts: { palette: 51, linework: 44 }
  }
];

// Vertical 9:16 Art Shorts Data
const artShorts = [
  {
    id: 101,
    title: "Peeling the Masking Tape — Sunset Acrylics",
    artist: "@kaze_ink_studio",
    supplies: "180ml Acrylics + Cold Press A4 Paper",
    artId: 1,
    palette: ["#ff4e00", "#ffb703", "#1b0c02"],
    stages: [
      "Stage 1: Raw Graphite Proportions & Guidelines",
      "Stage 2: Warm Alcohol Marker Underpainting",
      "Stage 3: Heavy Body Acrylic Flame Highlights",
      "Stage 4: Crisp Border Tape Peel & Final Varnish"
    ]
  },
  {
    id: 102,
    title: "Zero-Ruler Freehand Kachni Nib Linework",
    artist: "@vaidehi_folk_art",
    supplies: "48 Solid Watercolor Cakes + Fine Liner",
    artId: 3,
    palette: ["#e63946", "#ffb703", "#1d3557"],
    stages: [
      "Stage 1: Center Lotus Geometry Block-In",
      "Stage 2: Double-Line Kachni Border Detailing",
      "Stage 3: Layered Watercolor Cake Wash",
      "Stage 4: Final Folk Stippling & Signature"
    ]
  },
  {
    id: 103,
    title: "3-Tone Skin & Hair Shadow Layering",
    artist: "@zen_marker_works",
    supplies: "Brush-Tip Alcohol Markers + White Gel Pen",
    artId: 4,
    palette: ["#f72585", "#4cc9f0", "#240046"],
    stages: [
      "Stage 1: Dynamic Action Pose Construction",
      "Stage 2: Waterproof Fineliner Inking",
      "Stage 3: Wet-on-Wet Alcohol Marker Gradient",
      "Stage 4: Rim Lighting & Rim Highlights"
    ]
  }
];

// Active Escrow Contracts State
let escrowContracts = [
  {
    id: "ESC-901",
    title: "Custom Anime Half-Body Portrait",
    partner: "@kaze_ink_studio",
    totalInr: 2400,
    currentStage: 1, // 1 = Sketch (30%), 2 = Base (30%), 3 = Final (40%), 4 = Completed
    license: "Small Creator (+50%)"
  },
  {
    id: "ESC-902",
    title: "Brand Mascot — Traditional Watercolor Scan",
    partner: "@vaidehi_folk_art",
    totalInr: 3600,
    currentStage: 2,
    license: "Full Business (+150%)"
  }
];

let studioWalletInr = 6850;
let currency = "INR";
const USD_RATE = 84;
let activeFilters = { approach: "all", form: "all", medium: "all", search: "" };
let savedMoodboardIds = new Set();
let currentShortIndex = 0;
let currentShortStage = 3;
let selectedArtwork = null;
let selectedLicenseMultiplier = 1;
let isGoogleSignedIn = false;

function formatMoney(inr) {
  if (currency === "INR") return `₹${Math.round(inr).toLocaleString("en-IN")}`;
  return `$${Math.max(5, Math.round(inr / USD_RATE))}`;
}

// Switch Main App Tabs
window.switchTab = function (tabName) {
  document.querySelectorAll(".tab-view").forEach((el) => el.classList.add("hidden"));
  document.getElementById(`tab-${tabName}`).classList.remove("hidden");

  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  if (tabName === "shorts") renderCurrentShort();
  if (tabName === "escrow") renderEscrowDashboard();
  if (tabName === "profile") renderProfileMoodboard();
};

// Google Sign-In Simulation (Ready for Firebase Auth / Google OAuth Client ID)
window.handleGoogleSignIn = function () {
  isGoogleSignedIn = !isGoogleSignedIn;
  const btnText = document.getElementById("authBtnText");
  if (isGoogleSignedIn) {
    btnText.textContent = "arjun.art@gmail.com ✓";
    switchTab("profile");
  } else {
    btnText.textContent = "Sign in with Google";
  }
};

// Render Artwork SVG (Final vs Sketch Proof)
function renderArtSvg(art, isSketch) {
  const [c1, c2, c3] = art.palette;
  if (isSketch) {
    return `
      <svg width="100%" height="${art.height}" viewBox="0 0 400 260" preserveAspectRatio="none">
        <rect width="400" height="260" fill="#f3efe6"/>
        <line x1="0" y1="130" x2="400" y2="130" stroke="#94a3b8" stroke-dasharray="6,4"/>
        <line x1="200" y1="0" x2="200" y2="260" stroke="#94a3b8" stroke-dasharray="6,4"/>
        <circle cx="200" cy="115" r="55" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="5,3"/>
        <text x="18" y="240" fill="#1e293b" font-size="12" font-family="monospace">RAW HUMAN CONSTRUCTION SKETCH</text>
      </svg>
    `;
  }
  return `
    <svg width="100%" height="${art.height}" viewBox="0 0 400 260" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g-${art.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="55%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#g-${art.id})"/>
      <circle cx="200" cy="120" r="62" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <polygon points="200,52 260,172 140,172" fill="rgba(255,255,255,0.2)"/>
    </svg>
  `;
}

// Render Explore Grid
function renderGrid() {
  const grid = document.getElementById("artGrid");
  const filtered = artworks.filter((art) => {
    const mA = activeFilters.approach === "all" || art.approach === activeFilters.approach;
    const mF = activeFilters.form === "all" || art.form === activeFilters.form;
    const mM = activeFilters.medium === "all" || art.medium === activeFilters.medium;
    const q = activeFilters.search.toLowerCase();
    const mS = !q || art.title.toLowerCase().includes(q) || art.medium.toLowerCase().includes(q) || art.form.toLowerCase().includes(q);
    return mA && mF && mM && mS;
  });

  grid.innerHTML = filtered
    .map((art) => {
      const saved = savedMoodboardIds.has(art.id);
      return `
        <article class="art-card">
          <div class="canvas-preview" id="preview-${art.id}" data-sketch="false">
            ${renderArtSvg(art, false)}
            <span class="badge-top-left">✓ Proof-of-Craft</span>
            <button class="process-toggle-btn" onclick="toggleSketch(${art.id})">🔍 Before / After Sketch</button>
          </div>
          <div class="card-body">
            <span class="slot-scarcity">🔥 ${art.slotsLeft}</span>
            <h3>${art.title}</h3>
            <span style="font-size:13px; color:#94a3b8;">${art.artist} • ${art.form} (${art.medium})</span>

            <div class="craft-reactions">
              <button class="craft-btn" onclick="bumpCraft(${art.id}, 'palette')">🎨 Palette (${art.crafts.palette})</button>
              <button class="craft-btn" onclick="bumpCraft(${art.id}, 'linework')">✒️ Linework (${art.crafts.linework})</button>
              <button class="craft-btn" onclick="togglePin(${art.id})">${saved ? "★ Pinned" : "📌 Pin Ref"}</button>
            </div>

            <div class="card-footer">
              <strong>From ${formatMoney(art.baseInr)}</strong>
              <button class="btn-gradient" onclick="openCommissionModal(${art.id})">Commission</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

window.toggleSketch = function (id) {
  const art = artworks.find((a) => a.id === id);
  const el = document.getElementById(`preview-${id}`);
  const next = el.getAttribute("data-sketch") !== "true";
  el.setAttribute("data-sketch", String(next));
  el.innerHTML = `
    ${renderArtSvg(art, next)}
    <span class="badge-top-left">${next ? "📐 Raw Sketch Stage" : "✓ Proof-of-Craft"}</span>
    <button class="process-toggle-btn" onclick="toggleSketch(${art.id})">${next ? "🎨 View Final" : "🔍 Before / After Sketch"}</button>
  `;
};

window.bumpCraft = function (id, type) {
  const art = artworks.find((a) => a.id === id);
  art.crafts[type]++;
  renderGrid();
};

window.togglePin = function (id) {
  if (savedMoodboardIds.has(id)) savedMoodboardIds.delete(id);
  else savedMoodboardIds.add(id);
  document.getElementById("profileSavedCount").textContent = savedMoodboardIds.size;
  renderGrid();
};

// ==================== ART SHORTS PLAYER LOGIC ====================
function renderCurrentShort() {
  const short = artShorts[currentShortIndex];
  const [c1, c2, c3] = short.palette;
  const container = document.getElementById("shortsContainer");
  document.getElementById("shortCounter").textContent = `${currentShortIndex + 1} / ${artShorts.length}`;

  container.innerHTML = `
    <div class="short-canvas-bg">
      <svg width="100%" height="100%" viewBox="0 0 400 670" preserveAspectRatio="none">
        <defs>
          <linearGradient id="shortGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${currentShortStage === 0 ? '#e2e8f0' : c1}"/>
            <stop offset="55%" stop-color="${currentShortStage <= 1 ? '#94a3b8' : c2}"/>
            <stop offset="100%" stop-color="${c3}"/>
          </linearGradient>
        </defs>
        <rect width="400" height="670" fill="url(#shortGrad)"/>
        <circle cx="200" cy="290" r="${70 + currentShortStage * 18}" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      </svg>
    </div>

    <div class="short-overlay-top">
      <span class="verified-pill">🎬 Timelapse Process Short</span>
      <div class="short-stage-pills">
        ${[0, 1, 2, 3]
          .map(
            (idx) =>
              `<button class="stage-dot ${currentShortStage === idx ? "active" : ""}" onclick="setShortStage(${idx})">S${idx + 1}</button>`
          )
          .join("")}
      </div>
    </div>

    <div class="short-overlay-bottom">
      <span class="slot-scarcity">🧰 Supplies: ${short.supplies}</span>
      <h3>${short.title}</h3>
      <p style="font-size:13px; color:#ffb703; font-weight:600;">${short.stages[currentShortStage]}</p>
      <span style="font-size:13px; color:#cbd5e1;">${short.artist}</span>
      <div style="display:flex; gap:10px; margin-top:8px;">
        <button class="btn-gradient" style="flex:1;" onclick="openCommissionModal(${short.artId})">
          Commission This Style
        </button>
        <button class="btn-glass" onclick="setShortStage((currentShortStage + 1) % 4)">
          ⏭️ Step Process
        </button>
      </div>
    </div>
  `;
}

window.setShortStage = function (stageIdx) {
  currentShortStage = stageIdx;
  renderCurrentShort();
};

window.changeShort = function (dir) {
  currentShortIndex = (currentShortIndex + dir + artShorts.length) % artShorts.length;
  currentShortStage = 3;
  renderCurrentShort();
};

// ==================== ESCROW & SAFE MONEY TRANSFER LOGIC ====================
function renderEscrowDashboard() {
  let lockedTotal = 0;
  const list = document.getElementById("activeContractsList");

  list.innerHTML = escrowContracts
    .map((c) => {
      const remainingRatio = c.currentStage === 1 ? 1 : c.currentStage === 2 ? 0.7 : c.currentStage === 3 ? 0.4 : 0;
      const lockedAmount = c.totalInr * remainingRatio;
      lockedTotal += lockedAmount;

      const stageLabels = [
        "",
        "Stage 1 (30%): Waiting Sketch Approval",
        "Stage 2 (30%): Waiting Lineart/Base Approval",
        "Stage 3 (40%): Final Unwatermarked Delivery",
        "✅ All 3 Stages Released & License Unlocked"
      ];

      return `
        <div class="contract-row">
          <div>
            <span class="verified-pill">${c.id} • ${c.license}</span>
            <h4 style="margin-top:6px;">${c.title} (${c.partner})</h4>
            <p style="font-size:13px; color:#94a3b8;">Status: <strong style="color:#f8fafc;">${stageLabels[c.currentStage]}</strong></p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:14px; margin-bottom:8px;">
              Locked in Vault: <strong>${formatMoney(lockedAmount)}</strong> / ${formatMoney(c.totalInr)}
            </div>
            ${
              c.currentStage <= 3
                ? `<button class="btn-gradient" onclick="releaseNextMilestone('${c.id}')">Approve & Release Stage ${c.currentStage}</button>`
                : `<span class="verified-pill">Completed</span>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("escrowLockedTotal").textContent = formatMoney(lockedTotal);
  document.getElementById("studioWalletBalance").textContent = formatMoney(studioWalletInr);
  document.getElementById("activeEscrowBadge").textContent = escrowContracts.filter((c) => c.currentStage <= 3).length;
}

window.releaseNextMilestone = function (contractId) {
  const c = escrowContracts.find((item) => item.id === contractId);
  if (!c || c.currentStage > 3) return;

  const pct = c.currentStage === 3 ? 0.4 : 0.3;
  const payout = c.totalInr * pct;
  studioWalletInr += payout;
  c.currentStage++;
  renderEscrowDashboard();
};

window.withdrawFunds = function () {
  if (studioWalletInr <= 0) return;
  alert(`✅ Safe Payout Transferred: ${formatMoney(studioWalletInr)} sent to your linked UPI / Bank Account under your private Studio Handle!`);
  studioWalletInr = 0;
  renderEscrowDashboard();
};

// Profile Moodboard
function renderProfileMoodboard() {
  const container = document.getElementById("profileMoodboardList");
  if (savedMoodboardIds.size === 0) {
    container.innerHTML = `<p style="font-size:13px; color:#94a3b8;">No references pinned yet. Click "📌 Pin Ref" on any artwork in the Explore Feed.</p>`;
    return;
  }
  const saved = artworks.filter((a) => savedMoodboardIds.has(a.id));
  container.innerHTML = saved
    .map((a) => `<div class="tier-item"><strong>${a.title}</strong><span>${a.form} • ${a.medium}</span></div>`)
    .join("");
}

// Commission Modal
window.openCommissionModal = function (artId) {
  selectedArtwork = artworks.find((a) => a.id === artId);
  selectedLicenseMultiplier = 1;
  document.getElementById("modalArtistName").textContent = `Commission ${selectedArtwork.artist}`;
  document.getElementById("modalArtDetails").textContent = `${selectedArtwork.approach} • ${selectedArtwork.form} (${selectedArtwork.medium})`;
  updateEscrowMath();
  document.getElementById("commissionModal").classList.remove("hidden");
};

function updateEscrowMath() {
  if (!selectedArtwork) return;
  const ship = document.getElementById("deliveryMode").value === "physical" ? 450 : 0;
  const total = selectedArtwork.baseInr * selectedLicenseMultiplier + ship;
  document.getElementById("totalPriceDisplay").textContent = formatMoney(total);
  document.getElementById("stage1Price").textContent = formatMoney(total * 0.3);
  document.getElementById("stage2Price").textContent = formatMoney(total * 0.3);
  document.getElementById("stage3Price").textContent = formatMoney(total * 0.4);
}

window.openUploadModal = function () {
  alert("🎨 Proof-of-Craft Upload Studio: Here artists upload their Final Art + Raw Sketch/Desk Photo or 9:16 Timelapse Short!");
};

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderEscrowDashboard();

  document.querySelectorAll(".filter-group").forEach((group) => {
    const type = group.getAttribute("data-filter-type");
    group.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilters[type] = btn.getAttribute("data-value");
        renderGrid();
      });
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    activeFilters.search = e.target.value;
    renderGrid();
  });

  document.getElementById("currencyToggle").addEventListener("click", (e) => {
    currency = currency === "INR" ? "USD" : "INR";
    e.target.textContent = currency === "INR" ? "₹ INR" : "$ USD";
    renderGrid();
    renderEscrowDashboard();
    updateEscrowMath();
  });

  document.querySelectorAll(".license-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".license-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      selectedLicenseMultiplier = parseFloat(card.getAttribute("data-multiplier"));
      updateEscrowMath();
    });
  });

  document.getElementById("deliveryMode").addEventListener("change", updateEscrowMath);
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("commissionModal").classList.add("hidden");
  });

  document.getElementById("confirmEscrowBtn").addEventListener("click", () => {
    const ship = document.getElementById("deliveryMode").value === "physical" ? 450 : 0;
    const total = selectedArtwork.baseInr * selectedLicenseMultiplier + ship;
    escrowContracts.unshift({
      id: `ESC-${Math.floor(100 + Math.random() * 900)}`,
      title: `${document.getElementById("briefCategory").value} (${selectedArtwork.medium})`,
      partner: selectedArtwork.artist,
      totalInr: total,
      currentStage: 1,
      license: selectedLicenseMultiplier === 1 ? "Personal" : selectedLicenseMultiplier === 1.5 ? "Small Creator" : "Full Business"
    });
    document.getElementById("commissionModal").classList.add("hidden");
    switchTab("escrow");
  });
});
