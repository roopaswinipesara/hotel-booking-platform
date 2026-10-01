const hotels = [
  {
    id: 1,
    name: "Skyline Grand",
    location: "Hyderabad",
    price: 4200,
    rating: 4.8,
    rooms: 18,
    image: "image-1",
    amenities: ["Wi-Fi", "Pool", "Breakfast", "Parking"],
    room: "Deluxe King Room",
    description: "Modern rooms with city views and premium facilities."
  },
  {
    id: 2,
    name: "Heritage Palace",
    location: "Vijayawada",
    price: 3200,
    rating: 4.4,
    rooms: 9,
    image: "image-2",
    amenities: ["Wi-Fi", "Breakfast", "Parking"],
    room: "Executive Room",
    description: "Comfortable accommodation close to major attractions."
  },
  {
    id: 3,
    name: "Green Leaf Resort",
    location: "Bengaluru",
    price: 5600,
    rating: 4.7,
    rooms: 12,
    image: "image-3",
    amenities: ["Wi-Fi", "Pool", "Breakfast"],
    room: "Garden View Room",
    description: "A relaxing stay surrounded by greenery."
  },
  {
    id: 4,
    name: "Royal Orchid Suites",
    location: "Hyderabad",
    price: 6800,
    rating: 4.9,
    rooms: 7,
    image: "image-4",
    amenities: ["Wi-Fi", "Pool", "Breakfast", "Parking"],
    room: "Premium Suite",
    description: "Spacious suites designed for a comfortable premium stay."
  },
  {
    id: 5,
    name: "Harbor View Hotel",
    location: "Goa",
    price: 7500,
    rating: 4.6,
    rooms: 5,
    image: "image-5",
    amenities: ["Wi-Fi", "Pool", "Breakfast"],
    room: "Ocean View Room",
    description: "A peaceful property with a beautiful coastal atmosphere."
  },
  {
    id: 6,
    name: "Sunset Residency",
    location: "Vijayawada",
    price: 2800,
    rating: 4.2,
    rooms: 14,
    image: "image-6",
    amenities: ["Wi-Fi", "Parking"],
    room: "Standard Double Room",
    description: "Affordable rooms with convenient city access."
  }
];

const hotelGrid = document.getElementById("hotelGrid");
const resultCount = document.getElementById("resultCount");
const locationFilter = document.getElementById("locationFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const ratingFilter = document.getElementById("ratingFilter");
const amenityFilters = document.querySelectorAll(".amenity-filter");

function renderHotels(list = hotels) {
  resultCount.textContent = `${list.length} hotel${list.length === 1 ? "" : "s"}`;

  if (!list.length) {
    hotelGrid.innerHTML = `
      <div class="empty">
        <h3>No hotels found</h3>
        <p>Try changing the filters. Humanity survives another search.</p>
      </div>
    `;
    return;
  }

  hotelGrid.innerHTML = list.map(hotel => `
    <article class="hotel-card">
      <div class="hotel-image ${hotel.image}">
        <span class="tag">${hotel.rooms} rooms available</span>
      </div>
      <div class="hotel-body">
        <div class="hotel-top">
          <div>
            <h3>${hotel.name}</h3>
            <p class="location">📍 ${hotel.location}</p>
          </div>
          <span class="rating">★ ${hotel.rating}</span>
        </div>
        <p class="location">${hotel.description}</p>
        <div class="amenities">
          ${hotel.amenities.map(a => `<span class="amenity">${a}</span>`).join("")}
        </div>
        <div class="card-bottom">
          <div class="price">
            <strong>₹${hotel.price.toLocaleString("en-IN")}</strong>
            <small>/ night</small>
          </div>
          <button class="book-btn" onclick="openBooking(${hotel.id})">Book Now</button>
        </div>
      </div>
    </article>
  `).join("");
}

function applyFilters() {
  const location = locationFilter.value;
  const maxPrice = Number(priceFilter.value);
  const minRating = Number(ratingFilter.value);
  const selectedAmenities = [...amenityFilters]
    .filter(input => input.checked)
    .map(input => input.value);

  const filtered = hotels.filter(hotel => {
    const locationMatch = location === "all" || hotel.location === location;
    const priceMatch = hotel.price <= maxPrice;
    const ratingMatch = hotel.rating >= minRating;
    const amenityMatch = selectedAmenities.every(a => hotel.amenities.includes(a));

    return locationMatch && priceMatch && ratingMatch && amenityMatch;
  });

  renderHotels(filtered);
}

[locationFilter, priceFilter, ratingFilter].forEach(input => {
  input.addEventListener("input", () => {
    priceValue.textContent = priceFilter.value;
    applyFilters();
  });
});

amenityFilters.forEach(input => input.addEventListener("change", applyFilters));

document.getElementById("clearFilters").addEventListener("click", () => {
  locationFilter.value = "all";
  priceFilter.value = 10000;
  priceValue.textContent = "10000";
  ratingFilter.value = "0";
  amenityFilters.forEach(input => input.checked = false);
  applyFilters();
});

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const destination = document.getElementById("destination").value.trim();

  if (destination) {
    const matching = hotels.filter(hotel =>
      hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.name.toLowerCase().includes(destination.toLowerCase())
    );

    renderHotels(matching);
  } else {
    renderHotels(hotels);
  }

  document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
});

function openBooking(hotelId) {
  const hotel = hotels.find(h => h.id === hotelId);

  document.getElementById("modalHotel").textContent = hotel.name;
  document.getElementById("modalRoom").textContent =
    `${hotel.room} • ₹${hotel.price.toLocaleString("en-IN")} / night`;

  document.getElementById("modalCheckIn").value =
    document.getElementById("checkIn").value;
  document.getElementById("modalCheckOut").value =
    document.getElementById("checkOut").value;

  document.getElementById("bookingModal").classList.add("active");
  document.getElementById("bookingModal").dataset.hotelId = hotelId;
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function openLogin() {
  document.getElementById("loginModal").classList.add("active");
}

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();

  const hotelId = Number(document.getElementById("bookingModal").dataset.hotelId);
  const hotel = hotels.find(h => h.id === hotelId);
  const bookingId = "SE" + Math.floor(1000 + Math.random() * 9000);

  document.getElementById("bookingStat").textContent =
    Number(document.getElementById("bookingStat").textContent) + 1;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>#${bookingId}</td>
    <td>${document.getElementById("guestName").value}</td>
    <td>${hotel.name}</td>
    <td>${hotel.room}</td>
    <td><span class="status confirmed">Confirmed</span></td>
  `;

  document.getElementById("bookingTable").prepend(row);
  closeModal("bookingModal");

  showToast(`Booking confirmed! Your booking ID is #${bookingId}`);
  event.target.reset();
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  closeModal("loginModal");
  showToast("Login successful. Welcome to StayEase.");
  event.target.reset();
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.classList.remove("active");
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3500);
}

renderHotels();
