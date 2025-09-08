
    // Dummy data for ministry dashboard
    const workers = [
      { name: "Ravi Kumar", workType: "Waste Collection", credits: 120, status: "Active" },
      { name: "Sita Sharma", workType: "Waste Segregation", credits: 95, status: "Active" },
      { name: "Amit Singh", workType: "Fertilizer Making", credits: 110, status: "Inactive" },
      { name: "Neha Patel", workType: "Waste Collection", credits: 80, status: "Active" },
    ];

    const plants = [
      "Plant A - Location: Sector 12, Capacity: 500 kg/day",
      "Plant B - Location: Sector 7, Capacity: 300 kg/day",
      "Plant C - Location: Sector 3, Capacity: 450 kg/day",
    ];

    const products = [
      "Recycled Paper Notebooks",
      "Compost Fertilizer Bags",
      "Plastic Recycled Garden Pots",
      "Eco-friendly Shopping Bags",
    ];

    // Dummy recyclable goods for citizens
    const recyclableGoods = [
      { name: "Reusable Shopping Bag", cost: 50 },
      { name: "Compost Fertilizer (1kg)", cost: 100 },
      { name: "Recycled Paper Notebook", cost: 75 },
    ];

    // State variables
    let currentUser = null;
    let citizenCredits = 0;
    let employeeWorkDone = 0;
    let employeeWorkAvailable = 5; // example
    let employeeCredits = 0;
    let employeePreferences = [];

    // Elements
    const loginSection = document.getElementById("loginSection");
    const ministrySection = document.getElementById("ministrySection");
    const citizenSection = document.getElementById("citizenSection");
    const employeeSection = document.getElementById("employeeSection");
    const logoutBtn = document.getElementById("logoutBtn");

    // Ministry elements
    const workersTableBody = document.getElementById("workersTableBody");
    const plantsList = document.getElementById("plantsList");
    const productsList = document.getElementById("productsList");

    // Citizen elements
    const donateForm = document.getElementById("donateForm");
    const citizenCreditsEl = document.getElementById("citizenCredits");
    const recyclableGoodsList = document.getElementById("recyclableGoodsList");

    // Employee elements
    const workDoneEl = document.getElementById("workDone");
    const workAvailableEl = document.getElementById("workAvailable");
    const creditsReceivedEl = document.getElementById("creditsReceived");
    const workPreferenceForm = document.getElementById("workPreferenceForm");

    // Login form
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = e.target.username.value.trim();
      const userType = e.target.userType.value;

      if (!username || !userType) return;

      currentUser = { username, userType };
      showDashboard(userType);
      logoutBtn.classList.remove("hidden");
      e.target.reset();
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
      currentUser = null;
      citizenCredits = 0;
      employeeWorkDone = 0;
      employeeWorkAvailable = 5;
      employeeCredits = 0;
      employeePreferences = [];
      showDashboard(null);
      logoutBtn.classList.add("hidden");
    });

    // Show dashboard based on user type
    function showDashboard(userType) {
      loginSection.classList.toggle("hidden", userType !== null);
      ministrySection.classList.toggle("hidden", userType !== "ministry");
      citizenSection.classList.toggle("hidden", userType !== "citizen");
      employeeSection.classList.toggle("hidden", userType !== "employee");

      if (userType === "ministry") {
        renderMinistryDashboard();
      } else if (userType === "citizen") {
        renderCitizenDashboard();
      } else if (userType === "employee") {
        renderEmployeeDashboard();
      }
    }

    // Ministry dashboard render
    function renderMinistryDashboard() {
      // Workers table
      workersTableBody.innerHTML = "";
      workers.forEach((w) => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-300";
        tr.innerHTML = `
          <td class="p-2">${w.name}</td>
          <td class="p-2">${w.workType}</td>
          <td class="p-2">${w.credits}</td>
          <td class="p-2">${w.status}</td>
        `;
        workersTableBody.appendChild(tr);
      });

      // Plants list
      plantsList.innerHTML = "";
      plants.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        plantsList.appendChild(li);
      });

      // Products list
      productsList.innerHTML = "";
      products.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        productsList.appendChild(li);
      });
    }

    // Citizen dashboard render
    function renderCitizenDashboard() {
      citizenCreditsEl.textContent = citizenCredits;

      recyclableGoodsList.innerHTML = "";
      recyclableGoods.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center";
        li.innerHTML = `
          <span>${item.name} - ${item.cost} credits</span>
          <button data-idx="${idx}" class="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm">Redeem</button>
        `;
        recyclableGoodsList.appendChild(li);
      });
    }

    // Handle donation form submit
    donateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const item = e.target.donateItem.value.trim();
      const quantity = parseInt(e.target.donateQuantity.value);

      if (!item || quantity <= 0) return;

      // Simple credit calculation: 10 credits per item quantity
      const earnedCredits = quantity * 10;
      citizenCredits += earnedCredits;
      alert(`Thank you for donating! You earned ${earnedCredits} credits.`);
      e.target.reset();
      renderCitizenDashboard();
    });

    // Handle redeem buttons in citizen dashboard
    recyclableGoodsList.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const idx = e.target.getAttribute("data-idx");
        const item = recyclableGoods[idx];
        if (citizenCredits >= item.cost) {
          citizenCredits -= item.cost;
          alert(`You redeemed ${item.name} for ${item.cost} credits.`);
          renderCitizenDashboard();
        } else {
          alert("You do not have enough credits to redeem this item.");
        }
      }
    });

    // Employee dashboard render
    function renderEmployeeDashboard() {
      workDoneEl.textContent = employeeWorkDone;
      workAvailableEl.textContent = employeeWorkAvailable;
      creditsReceivedEl.textContent = employeeCredits;

      // Set checkboxes based on preferences
      const checkboxes = workPreferenceForm.querySelectorAll('input[name="workType"]');
      checkboxes.forEach((cb) => {
        cb.checked = employeePreferences.includes(cb.value);
      });
    }

    // Handle work preference form submit
    workPreferenceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selected = Array.from(e.target.workType)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      employeePreferences = selected;
      alert("Work preferences saved: " + (selected.length ? selected.join(", ") : "None"));
    });

    // Simulate employee doing work and earning credits every 10 seconds
    setInterval(() => {
      if (currentUser && currentUser.userType === "employee" && employeePreferences.length > 0 && employeeWorkAvailable > 0) {
        // Randomly pick a work from preferences
        const work = employeePreferences[Math.floor(Math.random() * employeePreferences.length)];
        employeeWorkDone++;
        employeeWorkAvailable--;
        employeeCredits += 20; // credits per work done
        renderEmployeeDashboard();
      }
    }, 10000);

    // Initial show login
    showDashboard(null);
