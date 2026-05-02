function showSection(id, btn) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(b => {
    b.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  }
}
let currentUserEmail = "";

async function handleGoogleLogin(response) {
  const res = await fetch("/api/google-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: response.credential })
  });

  const user = await res.json();
  currentUserEmail = user.email;

  document.getElementById("loggedInUser").textContent =
    `Logged in as ${user.name} (${user.email})`;

  document.getElementById("contact").value = user.email;
}
async function submitItem() {
  if (!currentUserEmail) {
    alert("Please sign in with Google first.");
    showSection("loginSection");
  return;
  }
  const item = {
    type: document.getElementById("type").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    contact: currentUserEmail
  };

  try {
    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    const data = await response.json();
    document.getElementById("reportResult").textContent = JSON.stringify(data, null, 2);

   
    document.getElementById("type").value = "lost";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("location").value = "";
    document.getElementById("contact").value = "";

    // Reload items
    await loadItems();

  } catch (err) {
    document.getElementById("reportResult").textContent = "Error: " + err.message;
  }
}

async function loadItems() {
  try {
    const response = await fetch("/api/items");
    const items = await response.json();
    renderItems(items);
  } catch (err) {
    document.getElementById("itemsList").innerHTML =
      `<p>Failed to load items: ${escapeHtml(err.message)}</p>`;
  }
}

async function searchItems() {
  const q = document.getElementById("searchQuery").value;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const items = await response.json();
    renderItems(items);
  } catch (err) {
    document.getElementById("itemsList").innerHTML =
      `<p>Search failed: ${escapeHtml(err.message)}</p>`;
  }
}

function renderItems(items) {
  const container = document.getElementById("itemsList");

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="item-card">
      <span class="badge">${escapeHtml(item.type || "item")}</span>
      <h3>${escapeHtml(item.title || "Untitled")}</h3>
      <p>${escapeHtml(item.description || "")}</p>
      <p><strong>Category:</strong> ${escapeHtml(item.category || "N/A")}</p>
      <p><strong>Location:</strong> ${escapeHtml(item.location || "N/A")}</p>
      <p><strong>Contact:</strong> ${escapeHtml(item.contact || "N/A")}</p>
    </div>
  `).join("");
}

async function loadLostReports() {
  const response = await fetch("/api/items?type=lost");
  const items = await response.json();
  renderItems(items);
}

async function loadFoundItems() {
  const response = await fetch("/api/items?type=found");
  const items = await response.json();
  renderItems(items);
}

async function searchFoundItems() {
  const q = document.getElementById("searchQuery").value;
  const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=found`);
  const items = await response.json();
  renderItems(items);
}


async function login() {
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    document.getElementById("loginResult").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("loginResult").textContent = "Error: " + err.message;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadItems();
