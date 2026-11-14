const artworks = [
  {
    id: 1,
    title: "Flame Hashira — Dynamic Layer Study",
    artist: "@kaze_ink_studio",
    approach: "Traditional",
    form: "Anime",
    medium: "Acrylic",
    baseInr: 1800,
    status: "Open",
    risingSlot: true,
    palette: ["#ff4e00", "#ec9f05", "#1f1300"],
    processNote: "Angled desk photo verified: Layered acrylic highlights over warm marker underpainting.",
  },
  {
    id: 2,
    title: "Sacred Grove — Sahyadri Harvest",
    artist: "@tara_warli_craft",
    approach: "Traditional",
    form: "Warli",
    medium: "Acrylic",
    baseInr: 2400,
    status: "Open",
    risingSlot: true,
    palette: ["#8d4004", "#f5f0e6", "#3d1e05"],
    processNote: "Raw geometric grid sketch on treated terracotta background verified.",
  },
  {
    id: 3,
    title: "Mithila Peacock & Lotus Mandala",
    artist: "@vaidehi_folk_art",
    approach: "Traditional",
    form: "Madhubani",
    medium: "Watercolor",
    baseInr: 3200,
    status: "Open",
    risingSlot: false,
    palette: ["#d90429", "#ffb703", "#023047"],
    processNote: "Nib-pen Kachni linework & natural watercolor cake wash verified.",
  },
  {
    id: 4,
    title: "Cyberpunk Samurai Character Sheet",
    artist: "@ryu_character_lab",
    approach: "Digital",
    form: "Anime",
    medium: "Digital Brush",
    baseInr: 2800,
    status: "Open",
    risingSlot: false,
    palette: ["#00f5d4", "#7b2cbf", "#0f0e17"],
    processNote: "Raw .PSD layer tree inspected: Sketch, vector lineart, and shadow multiply layers.",
  },
  {
    id: 5,
    title: "Chiaroscuro Portrait — Old Fisherman",
    artist: "@aravind_finearts",
    approach: "Traditional",
    form: "Realism",
    medium: "Charcoal",
    baseInr: 2100,
    status: "Waitlist",
    risingSlot: true,
    palette: ["#2b2d42", "#8d99ae", "#edf2f4"],
    processNote: "Willow charcoal block-in & kneaded eraser highlight stages verified.",
  },
  {
    id: 6,
    title: "Shonen Action Keyframe Illustration",
    artist: "@zen_marker_works",
    approach: "Traditional",
    form: "Anime",
    medium: "Alcohol Markers",
    baseInr: 1500,
    status: "Open",
    risingSlot: true,
    palette: ["#f72585", "#4cc9f0", "#3a0ca3"],
    processNote: "Pencil construction lines + alcohol marker bleed-proof paper proof verified.",
  },
  {
    id: 7,
    title: "Botanical Dusk — Golden Hour Study",
    artist: "@meera_prism",
    approach: "Traditional",
    form: "Realism",
    medium: "Colored Pencils",
    baseInr: 1900,
    status: "Open",
    risingSlot: false,
    palette: ["#bc6c25", "#dda15e", "#283618"],
    processNote: "3-tone shadow layering & burnishing pencil desk proof verified.",
  },
  {
    id: 8,
    title: "Floating Citadel — Environment Concept",
    artist: "@nova_worldbuild",
    approach: "Digital",
    form: "Concept",
    medium: "Digital Brush",
    baseInr: 4500,
    status: "Open",
    risingSlot: false,
    palette: ["#3a86ff", "#8338ec", "#1d3557"],
    processNote: "3-point perspective grid + greyscale value thumbnail verified.",
  }
];

let activeFilters = {
  approach: "all",
  form: "all",
  medium: "all",
  search: ""
};

let currency = "INR"; // 'INR' or 'USD'
const USD_RATE = 84;
let savedMoodboardIds = new Set();
let selectedArtwork = null;
let selectedLicenseMultiplier = 1;

// Generate dynamic SVG artwork for Final vs. Raw Sketch Process view
function renderArtSvg(art, isSketchView) {
  const [c1, c2, c3] = art.palette;
  if (isSketchView) {
    return `
      <svg class="canvas-svg" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="260" fill="#f4f1ea"/>
        <line x1="0" y1="130" x2="400" y2="130" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1"/>
        <line x1="200" y1="0" x2="200" y2="260" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1"/>
        <circle cx="200" cy="115" r="58" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6,3"/>
        <path d="M135 210 Q200 150 265 210" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="16" y="238" fill="#1e293b" font-size="11" font-family="monospace">
          RAW WORKSPACE PROOF: ${art.processNote.slice(0, 48)}...
        </text>
      </svg>
    `;
  }

  return `
    <svg class="canvas-svg" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${art.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="55%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#grad-${art.id})"/>
      <circle cx="200" cy="120" r="64" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <polygon points="200,52 258,168 142,168" fill="rgba(255,255,255,0.18)" />
      <text x="16" y="242" fill="rgba(255,255,255,0.85)" font-size="11" font-weight="600">
        🛡️ Molt Glaze Protected • ${art.form} (${art.medium})
      </svg>
  `;
}

function formatMoney(inrAmount) {
  if (currency === "INR") {
    return `₹${Math.round(inrAmount).toLocaleString("en-IN")}`;
  }
  const usd = Math.max(5, Math.round(inrAmount / USD_RATE));
  return `$${usd}`;
}

function renderGrid() {
  const grid = document.getElementById("artGrid");
  const filtered = artworks.filter((art) => {
    const matchApproach = activeFilters.approach === "all" || art.approach === activeFilters.approach;
    const matchForm = activeFilters.form === "all" || art.form === activeFilters.form;
    const matchMedium = activeFilters.medium === "all" || art.medium === activeFilters.medium;
    const q = activeFilters.search.toLowerCase();
    const matchSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.form.toLowerCase().includes(q) ||
      art.medium.toLowerCase().includes(q) ||
      art.approach.toLowerCase().includes(q) ||
      art.artist.toLowerCase().includes(q);
    return matchApproach && matchForm && matchMedium && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#9ca3af; grid-column: 1/-1; padding: 30px 0;">No human artworks match that exact filter combination yet. Try clicking "All Mediums" or "All Forms".</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map((art) => {
      const isSaved = savedMoodboardIds.has(art.id);
      return `
        <article class="art-card" data-id="${art.id}">
          <div class="canvas-preview" id="preview-${art.id}" data-sketch="false">
            ${renderArtSvg(art, false)}
            <span class="badge-top-left">✓ Human Proof-of-Craft</span>
            ${art.risingSlot ? `<span class="badge-rising">★ Rising Artist Slot</span>` : ""}
            <button class="process-toggle-btn" onclick="toggleProcessView(${art.id})">
              🔍 Inspect Raw Sketch
            </button>
          </div>

          <div class="card-body">
            <div class="card-title-row">
              <h3>${art.title}</h3>
              <span class="status-pill ${art.status === "Open" ? "status-open" : "status-waitlist"}">
                ● ${art.status}
              </span>
            </div>
            <span class="artist-handle">${art.artist}</span>

            <div class="taxonomy-tags">
              <span class="tag">${art.approach}</span>
              <span class="tag">${art.form}</span>
              <span class="tag">${art.medium}</span>
            </div>

            <div class="card-footer">
              <span class="price-tag">From ${formatMoney(art.baseInr)}</span>
              <div class="card-actions">
                <button class="btn-secondary" onclick="toggleMoodboard(${art.id})">
                  ${isSaved ? "★ Saved" : "📌 Pin Ref"}
                </button>
                <button class="btn-primary" onclick="openCommissionModal(${art.id})">
                  Commission
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Toggle between Final Artwork and Raw Sketch/Workspace proof
window.toggleProcessView = function (artId) {
  const art = artworks.find((a) => a.id === artId);
  const container = document.getElementById(`preview-${artId}`);
  const isCurrentlySketch = container.getAttribute("data-sketch") === "true";
  const nextSketchState = !isCurrentlySketch;

  container.setAttribute("data-sketch", String(nextSketchState));
  container.innerHTML = `
    ${renderArtSvg(art, nextSketchState)}
    <span class="badge-top-left">${nextSketchState ? "📐 Raw Process Proof" : "✓ Human Proof-of-Craft"}</span>
    ${art.risingSlot ? `<span class="badge-rising">★ Rising Artist Slot</span>` : ""}
    <button class="process-toggle-btn" onclick="toggleProcessView(${art.id})">
      ${nextSketchState ? "🎨 View Final Art" : "🔍 Inspect Raw Sketch"}
    </button>
  `;
};

// Pin to Moodboard & Matchmake with Open Artists
window.toggleMoodboard = function (artId) {
  if (savedMoodboardIds.has(artId)) {
    savedMoodboardIds.delete(artId);
  } else {
    savedMoodboardIds.add(artId);
  }
  document.getElementById("savedCount").textContent = savedMoodboardIds.size;

  const bar = document.getElementById("moodboardBar");
  const summary = document.getElementById("moodboardSummary");

  if (savedMoodboardIds.size > 0) {
    bar.classList.remove("hidden");
    const savedArts = artworks.filter((a) => savedMoodboardIds.has(a.id));
    const styles = [...new Set(savedArts.map((a) => `${a.form} (${a.medium})`))].join(", ");
    summary.textContent = `You pinned ${savedMoodboardIds.size} reference(s) matching: ${styles}. All listed creators accept Escrow Milestones!`;
  } else {
    bar.classList.add("hidden");
  }
  renderGrid();
};

// Open Escrow & Commercial Licensing Modal
window.openCommissionModal = function (artId) {
  selectedArtwork = artworks.find((a) => a.id === artId);
  selectedLicenseMultiplier = 1;

  document.getElementById("modalArtistName").textContent = `Commission ${selectedArtwork.artist}`;
  document.getElementById("modalArtDetails").textContent =
    `${selectedArtwork.approach} • ${selectedArtwork.form} • Medium: ${selectedArtwork.medium}`;

  document.querySelectorAll(".license-card").forEach((card) => {
    card.classList.toggle("active", card.getAttribute("data-multiplier") === "1");
  });

  updateEscrowMath();
  document.getElementById("commissionModal").classList.remove("hidden");
};

function updateEscrowMath() {
  if (!selectedArtwork) return;
  const deliveryMode = document.getElementById("deliveryMode").value;
  const shippingAddonInr = deliveryMode === "physical" ? 450 : 0;
  const totalInr = selectedArtwork.baseInr * selectedLicenseMultiplier + shippingAddonInr;

  const s1 = totalInr * 0.3;
  const s2 = totalInr * 0.3;
  const s3 = totalInr * 0.4;

  document.getElementById("totalPriceDisplay").textContent = formatMoney(totalInr);
  document.getElementById("stage1Price").textContent = formatMoney(s1);
  document.getElementById("stage2Price").textContent = formatMoney(s2);
  document.getElementById("stage3Price").textContent = formatMoney(s3);
}

// Setup Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();

  // Filter buttons
  document.querySelectorAll(".filter-group").forEach((group) => {
    const filterType = group.getAttribute("data-filter-type");
    group.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilters[filterType] = btn.getAttribute("data-value");
        renderGrid();
      });
    });
  });

  // Search Input
  document.getElementById("searchInput").addEventListener("input", (e) => {
    activeFilters.search = e.target.value;
    renderGrid();
  });

  // Currency Toggle
  document.getElementById("currencyToggle").addEventListener("click", (e) => {
    currency = currency === "INR" ? "USD" : "INR";
    e.target.textContent =
      currency === "INR" ? "Currency: ₹ INR (UPI/Card)" : "Currency: $ USD (Global)";
    renderGrid();
    updateEscrowMath();
  });

  // Clear Moodboard
  document.getElementById("clearMoodboard").addEventListener("click", () => {
    savedMoodboardIds.clear();
    document.getElementById("savedCount").textContent = "0";
    document.getElementById("moodboardBar").classList.add("hidden");
    renderGrid();
  });

  // License Cards
  document.querySelectorAll(".license-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".license-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      selectedLicenseMultiplier = parseFloat(card.getAttribute("data-multiplier"));

      const note = document.getElementById("licenseExplanation");
      if (selectedLicenseMultiplier === 1) {
        note.textContent =
          "📄 Auto-generates a Personal Use PDF License: Artist retains copyright; buyer gets personal display rights.";
      } else if (selectedLicenseMultiplier === 1.5) {
        note.textContent =
          "📄 Auto-generates a Small Creator PDF License: Covers monetized streams, indie books & social channels.";
      } else {
        note.textContent =
          "📄 Auto-generates a Full Commercial PDF License: Covers merchandise runs, brand logos & commercial campaigns.";
      }
      updateEscrowMath();
    });
  });

  document.getElementById("deliveryMode").addEventListener("change", updateEscrowMath);

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("commissionModal").classList.add("hidden");
  });

  document.getElementById("confirmEscrowBtn").addEventListener("click", () => {
    alert(
      `✅ Escrow Vault Initialized for ${selectedArtwork.artist}!\n\n` +
        `• 100% of funds are locked safely in Molt Escrow.\n` +
        `• Stage 1 (30%) unlocks only after you approve the watermarked sketch.\n` +
        `• Commercial License PDF & High-Res file unlock automatically at Stage 3.`
    );
    document.getElementById("commissionModal").classList.add("hidden");
  });
});// Molt Logic
