async function loadMenu() {
  const response = await fetch("data/menu.json");
  const menu = await response.json();
  const menuContainer = document.getElementById('menu');

  menu.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';

    // Product Name
    const itemTitle = document.createElement('h2');
    itemTitle.innerText = item.name;
    itemDiv.appendChild(itemTitle);

    // Product Description
    const itemDescription = document.createElement('p');
    itemDescription.innerText = item.description;
    itemDiv.appendChild(itemDescription);

    // Icons (Vegan, Vegetarian, or Meat)
    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'icons';

    const foodIcon = document.createElement('img');
    if (item.vegan) {
      foodIcon.src = 'images/icons/vegan.svg'; // Vegan icon
      foodIcon.alt = 'Vegan';
      foodIcon.setAttribute('data-tooltip', 'Vegan');
    } else if (item.vegetarian) {
      foodIcon.src = 'images/icons/vegetarian.svg'; // Vegetarian icon
      foodIcon.alt = 'Vegetarian';
      foodIcon.setAttribute('data-tooltip', 'Vegetarian');
    } else {
      foodIcon.src = 'images/icons/meat.svg'; // Meat icon
      foodIcon.alt = 'Meat';
      foodIcon.setAttribute('data-tooltip', 'Meat');
    }
    iconsDiv.appendChild(foodIcon);

    // Price
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.innerText = item.price;

    // Menu Button (Ingredients & Allergens Tooltip)
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.innerText = '☰'; // Hamburger icon or keyboard menu key
    menuButton.setAttribute('data-tooltip', `Ingredients:\n${item.ingredients}\n\nAllergens:\n${item.allergens || 'None'}`);

    // Bottom Row (Icons, Price, and Menu Button)
    const bottomRow = document.createElement('div');
    bottomRow.className = 'bottom-row';
    bottomRow.appendChild(iconsDiv);
    bottomRow.appendChild(priceDiv);
    bottomRow.appendChild(menuButton);

    // Append bottom row to menu item
    itemDiv.appendChild(bottomRow);

    menuContainer.appendChild(itemDiv);
  });
}

// Load menu immediately
loadMenu();
