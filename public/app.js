function showSection(id, btn) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

async function submitItem() {
  const item = {
    type: document.getElementById("type").value,
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value.trim().toLowerCase(),
    location: document.getElementById("location").value.trim(),
    contact: document.getElementById("contact").value.trim()
  };

  if (!item.title || !item.category || !item.contact) {
    showInfo("Please fill title, category, and email.", "error");
    return;
  }

  const response = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });

  const data = await response.json();
  const matches = data.matches || [];

  if (matches.length > 0) {
    showMatchNotification(item, matches[0]);
  } else {
    showInfo("Item reported successfully. No immediate match found yet.", "success");
  }

  document.getElementById("reportResult").textContent = JSON.stringify(data, null, 2);

  clearForm();
  loadLostReports();
  loadFoundItems();
}

function showMatchNotification(item, match) {
  document.getElementById("matchNotification").innerHTML = `
    <div class="match-alert">
      <div class="match-icon">🎉</div>
      <div>
        <h3>${item.type === "lost" ? "Good news! Your item may have been found." : "This found item may match a lost report."}</h3>
        <p><strong>${escapeHtml(match.title)}</strong> was reported as <strong>${escapeHtml(match.type)}</strong>.</p>
        <p><strong>Location:</strong> ${escapeHtml(match.location || "N/A")}</p>
        <p><strong>Contact:</strong> ${escapeHtml(match.contact || "N/A")}</p>
      </div>
    </div>
  `;
}

function showInfo(message, type) {
  document.getElementById("matchNotification").innerHTML = `
    <div class="${type === "error" ? "error-alert" : "success-alert"}">
      ${escapeHtml(message)}
    </div>
  `;
}

function clearForm() {
  document.getElementById("type").value = "lost";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("location").value = "";
  document.getElementById("contact").value = "";
}

async function loadLostReports() {
  const res = await fetch("/api/items?type=lost");
  const items = await res.json();
  renderItems(items, "lostItemsList");
}

async function loadFoundItems() {
  const res = await fetch("/api/items?type=found");
  const items = await res.json();
  renderItems(items, "foundItemsList");
}

async function searchItems() {
  const q = document.getElementById("searchQuery").value;
  const type = document.getElementById("searchType").value;

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`);
  const items = await res.json();

  renderItems(items, "itemsList");
}

function renderItems(items, id) {
  const el = document.getElementById(id);

  if (!items || items.length === 0) {
    el.innerHTML = `<div class="empty-state">No items found.</div>`;
    return;
  }

  el.innerHTML = items.map(i => `
    <div class="item-card">
      <span class="badge">${escapeHtml(i.type)}</span>
      <h3>${escapeHtml(i.title)}</h3>
      <p>${escapeHtml(i.description || "")}</p>
      <div class="meta">
        <span>📍 ${escapeHtml(i.location || "N/A")}</span>
        <span>🏷 ${escapeHtml(i.category || "N/A")}</span>
      </div>
      <p class="contact">Contact: ${escapeHtml(i.contact || "N/A")}</p>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadLostReports();
loadFoundItems();