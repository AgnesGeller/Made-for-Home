
AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 900, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init();

  // Navbar elements
  var navbarToggler = document.querySelector('.navbar-toggler');
  var navbarMenu = document.querySelector('#navbarNav');
  var submenus = document.querySelectorAll('.dropdown-submenu');
  
  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var timeString = hours + ':' + minutes + ':' + seconds;
    document.getElementById('digital-clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock(); // initial call to display the clock immediately


  // Toggle submenus on click
  navbarMenu.addEventListener('click', function(event) {
      var submenuTrigger = event.target.closest('.dropdown-submenu .dropdown-toggle');
      if (submenuTrigger) {
          event.preventDefault();
          var submenu = submenuTrigger.nextElementSibling;
          submenu.classList.toggle('show');
      }
  });

  // Close the navbar when a nav-link is clicked on mobile
  navbarMenu.addEventListener('click', function(event) {
      if (event.target.classList.contains('nav-link')) {
          if (navbarToggler.offsetParent !== null) {
              navbarToggler.click();
          }
      }
  });

  // Close all submenus when toggler is clicked
  navbarToggler.addEventListener('click', function() {
      submenus.forEach(function(submenu) {
          if (submenu.classList.contains('show')) {
              submenu.classList.remove('show');
          }
      });
  });

  // Close submenus when clicking outside on mobile
  document.addEventListener('touchstart', function(event) {
      if (!navbarMenu.contains(event.target)) {
          submenus.forEach(function(submenu) {
              if (submenu.classList.contains('show')) {
                  submenu.classList.remove('show');
              }
          });
      }
  });

  // Form submission
  var form = document.getElementById('myForm');
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      var formData = new FormData(form);
      fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
              'Accept': 'application/json'
          }
      }).then(response => {
          if (response.ok) {
              alert('Thank you. Your message has been sent');
              form.reset();
          } else {
              response.json().then(data => {
                  if (Object.hasOwn(data, 'errors')) {
                      alert(data["errors"].map(error => error["message"]).join(", "));
                  } else {
                      alert('Something error...');
                  }
              });
          }
      }).catch(error => {
          alert('Somithing error.. message has not been sent');
      });
  });
});

// Árak (Excel adatok alapján szerkeszthető)
const prices = [
    { id: "mowing", name: "Regular Domestic Cleaning", unit: "h", price: 17},
    { id: "planting", name: "Weekly Cleaning", unit: "pc", price: 17},
    { id: "gravel", name: "Fortnightly Cleaning", unit: "h", price: 19},
    { id: "paving", name: "One-Off and Deep Cleanin", unit: "h", price: 23},
    { id: "weeding", name: "End of Tenancy Cleaning", unit: "h", price: 25},
    { id: "weeding", name: "Spring Cleaning", unit: "h", price: 26},
    // További tételek hozzáadhatók...
  ];
  
  // Kosár tételeinek tárolása
  const cart = [];
  
  // Munka típusok betöltése (dinamikus generálás)
  function populateWorkTypes() {
    const workTypeSelect = document.getElementById("workType");
    prices.forEach(task => {
      const option = document.createElement("option");
      option.value = task.id;
      option.textContent = `${task.name} (${task.price} GBP/${task.unit})`;
      workTypeSelect.appendChild(option);
    });
  }
  
  // Új tétel hozzáadása a kosárhoz
  function addItem() {
    const workTypeId = document.getElementById("workType").value;
    const area = parseFloat(document.getElementById("area").value) || 0;
    const count = parseFloat(document.getElementById("count").value) || 0;
  
    // Ellenőrzés: nincs negatív érték
    if (!workTypeId || area < 0 || count < 0 || (area === 0 && count === 0)) {
      alert("Please provide valid and positive data!");
      return;
    }
  
    const task = prices.find(item => item.id === workTypeId);
  
    let cost = 0;
    if (task.unit === "h") {
      cost = task.price * area; // Négyzetméter alapú számítás
    } else if (task.unit === "piece") {
      cost = task.price * count; // Darabszám alapú számítás
    } else if (task.unit === "h") {
      cost = task.price * area; // Köbméter alapú számítás
    } else {
      alert("Unsupported unit.");
      return;
    }
  
    cart.push({ name: task.name, area, count, cost });
    updateItemList();
    updateTotalCost();
  }
  
  // Kiválasztott tételek megjelenítése a kosárban
  function updateItemList() {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = ""; // Korábbi tételek törlése
  
    cart.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - ${item.area ? `${item.area} h` : ""} ${item.count ? `${item.count} pc` : ""} = ${item.cost} GBP`;
  
      // Eltávolítás gomb hozzáadása
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Removal";
      deleteButton.onclick = () => removeItem(index);
      listItem.appendChild(deleteButton);
  
      itemList.appendChild(listItem);
    });
  }
  
  // Tétel eltávolítása a kosárból
  function removeItem(index) {
    cart.splice(index, 1); // Tétel törlése
    updateItemList();
    updateTotalCost();
  }
  
  // Végösszeg frissítése
  function updateTotalCost() {
    const total = cart.reduce((sum, item) => sum + item.cost, 0); // Teljes ár kiszámítása
    document.getElementById("totalCost").textContent = `${total} GBP`;
  }
  
  // Oldal betöltésekor a munka típusok megjelenítése
  document.addEventListener("DOMContentLoaded", populateWorkTypes);
