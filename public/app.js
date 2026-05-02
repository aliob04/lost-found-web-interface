function showSection(id, btn) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

async function submitItem() {
  const item = {
    type: document.getElementById("type").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    contact: document.getElementById("contact").value
  };

  const response = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });

  const data = await response.json();

  const matches = data.matches || [];

  if (matches.length > 0) {
    showMatchNotification(matches[0]);
  } else {
    document.getElementById("matchNotification").innerHTML = "";
  }

  document.getElementById("reportResult").textContent = JSON.stringify(data, null, 2);

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
  document.getElementById("location").value = "";
  document.getElementById("contact").value = "";

  loadLostReports();
  loadFoundItems();
}

function showMatchNotification(match) {
  document.getElementById("matchNotification").innerHTML = `
    <div class="match-alert">
      🎉 Match Found!
      <br>
      ${match.title} (${match.location})
      <br>
      Contact: ${match.contact}
    </div>
  `;
}

async function loadLostReports() {
  const res = await fetch("/api/items?type=lost");
  const items = await res.json();
  render(items, "lostItemsList");
}

async function loadFoundItems() {
  const res = await fetch("/api/items?type=found");
  const items = await res.json();
  render(items, "foundItemsList");
}

async function searchItems() {
  const q = document.getElementById("searchQuery").value;
  const type = document.getElementById("searchType").value;

  const res = await fetch(`/api/search?q=${q}&type=${type}`);
  const items = await res.json();

  render(items, "itemsList");
}

function render(items, id) {
  const el = document.getElementById(id);

  if (!items.length) {
    el.innerHTML = '<p class="empty-msg">No items found.</p>';
    return;
  }

  el.innerHTML = items.map(i => {
    const typeBadge = i.type === "lost"
      ? '<span class="badge badge-lost">Lost</span>'
      : '<span class="badge badge-found">Found</span>';
    const category = i.category ? `<span class="card-meta-item">🏷 ${i.category}</span>` : "";
    const location  = i.location  ? `<span class="card-meta-item">📍 ${i.location}</span>`  : "";
    const desc = i.description || "No description provided.";

    return `
      <div class="item-card">
        <div class="card-top">
          ${typeBadge}
          <h3 class="card-title">${i.title}</h3>
        </div>
        <p class="card-desc">${desc}</p>
        <div class="card-meta">
          ${category}
          ${location}
        </div>
      </div>
    `;
  }).join("");
}