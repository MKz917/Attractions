let attractions = [];
let currentState = 'all';
let currentCategory = 'all';

document.addEventListener("DOMContentLoaded", () => {
  loadXML();

  document.getElementById("stateSelect").addEventListener("change", (e) => {
    currentState = e.target.value;
    displayAttractionList();
  });

  document.getElementById("categorySelect").addEventListener("change", (e) => {
    currentCategory = e.target.value;
    displayAttractionList();
  });
});

function loadXML() {
  fetch("attractions.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const nodes = xml.getElementsByTagName("attraction");

      for (let i = 0; i < nodes.length; i++) {
        const attr = nodes[i];
        attractions.push({
          placeID: attr.getElementsByTagName("placeID")[0].textContent,
          name: attr.getElementsByTagName("name")[0].textContent,
          city: attr.getElementsByTagName("city")[0].textContent,
          state: attr.getElementsByTagName("state")[0].textContent,
          description: attr.getElementsByTagName("description")[0].textContent,
          openingHours: attr.getElementsByTagName("openingHours")[0].textContent,
          category: attr.getElementsByTagName("category")[0].textContent,
          ticket: attr.getElementsByTagName("ticket")[0].textContent,
          price: attr.getElementsByTagName("price")[0].textContent,
          image: attr.getElementsByTagName("image")[0].textContent
        });
      }

      populateDropdowns();
      displayAttractionList();
    })
    .catch(error => {
      console.error("Error loading XML:", error);
    });
}

function populateDropdowns() {
  const stateSelect = document.getElementById("stateSelect");
  const categorySelect = document.getElementById("categorySelect");

  const states = [...new Set(attractions.map(attr => attr.state))];
  const categories = [...new Set(attractions.map(attr => attr.category))];

  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function displayAttractionList() {
  const listDiv = document.getElementById("attractionList");
  const detailDiv = document.getElementById("detailView");
  const backButton = document.getElementById("backButtonContainer");

  listDiv.style.display = "block";
  detailDiv.style.display = "none";
  backButton.style.display = "none";

  listDiv.innerHTML = "";

  const filtered = attractions.filter(attr => {
    const stateMatch = currentState === "all" || attr.state === currentState;
    const categoryMatch = currentCategory === "all" || attr.category === currentCategory;
    return stateMatch && categoryMatch;
  });

  if (filtered.length === 0) {
    listDiv.innerHTML = "<p>No attractions found for this filter.</p>";
    return;
  }

  filtered.forEach(attr => {
    const item = document.createElement("div");
    item.classList.add("attraction");
    item.innerHTML = `<h3><a href="#" onclick="showDetail('${attr.placeID}')">${attr.placeID} - ${attr.name}</a></h3>`;
    listDiv.appendChild(item);
  });
}

function showDetail(placeID) {
  const attraction = attractions.find(attr => attr.placeID === placeID);
  if (!attraction) return;

  const listDiv = document.getElementById("attractionList");
  const detailDiv = document.getElementById("detailView");
  const backButton = document.getElementById("backButtonContainer");

  listDiv.style.display = "none";
  detailDiv.style.display = "block";
  backButton.style.display = "flex";

  detailDiv.innerHTML = `
    <h2>${attraction.placeID} - ${attraction.name}</h2>
    <p><strong>City:</strong> ${attraction.city}</p>
    <p><strong>State:</strong> ${attraction.state}</p>
    <p><strong>Category:</strong> ${attraction.category}</p>
    <p><strong>Description:</strong> ${attraction.description}</p>
    <p><strong>Opening Hours:</strong> ${attraction.openingHours}</p>
    <p><strong>Ticket Required:</strong> ${attraction.ticket}</p>
    <p><strong>Price (RM):</strong> ${attraction.price}</p>
    <img src="${attraction.image}" alt="${attraction.name}" style="width:100%; max-width:400px; margin-top:10px; border-radius:10px;" />
  `;
}

function goBackToList() {
  displayAttractionList();
}
