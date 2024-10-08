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

    const iconWrapper = document.createElement('span');
    iconWrapper.className = 'icon-wrapper';
    
    const foodIcon = document.createElement('img');
    if (item.vegan) {
      foodIcon.src = 'images/icons/vegan.svg'; // Vegan icon
      foodIcon.alt = 'Vegan';
      iconWrapper.setAttribute('data-tooltip', 'Vegan');
    } else if (item.vegetarian) {
      foodIcon.src = 'images/icons/vegetarian.svg'; // Vegetarian icon
      foodIcon.alt = 'Vegetarian';
      iconWrapper.setAttribute('data-tooltip', 'Vegetarian');
    } else {
      foodIcon.src = 'images/icons/meat.svg'; // Meat icon
      foodIcon.alt = 'Meat';
      iconWrapper.setAttribute('data-tooltip', 'Meat');
    }
    
    iconWrapper.appendChild(foodIcon); // Wrap the icon inside a span
    iconsDiv.appendChild(iconWrapper); // Add the icon wrapper to the iconsDiv

    // Price
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.innerText = item.price;

    // Menu Button (Ingredients & Allergens Tooltip)
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';

    const buttonIcon = document.createElement('img');
    buttonIcon.src = 'images/icons/list.svg';
    buttonIcon.alt = 'Menu Icon';
    buttonIcon.style.width = '24px';
    buttonIcon.style.height = '24px';

    menuButton.appendChild(buttonIcon); // Append the SVG icon to the button

    // Set tooltip with ingredients and allergens
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
