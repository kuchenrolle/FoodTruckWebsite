async function loadMenu() {
  const response = await fetch("data/menu.json");
  const menu = await response.json();
  const menuContainer = document.getElementById('menu');

  menuContainer.innerHTML = '';

  const grouped = new Map();
  menu.items.filter(item => item.active).forEach(item => {
    const key = item.submenu || 'Menu';
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });

  grouped.forEach((items, sectionTitle) => {
    const section = document.createElement('section');
    section.className = 'menu-section';

    const heading = document.createElement('h2');
    heading.className = 'menu-section-title';
    heading.innerText = sectionTitle;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    section.appendChild(grid);

    items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';

    // Product Name
    const itemTitle = document.createElement('h3');
    itemTitle.className = 'menu-name';
    itemTitle.innerText = item.name;
    const headerRow = document.createElement('div');
    headerRow.className = 'menu-header';
    headerRow.appendChild(itemTitle);

    // Price
    const priceDiv = document.createElement('div');
    priceDiv.className = 'menu-price';
    priceDiv.innerText = item.price;
    headerRow.appendChild(priceDiv);
    itemDiv.appendChild(headerRow);

    // Tags
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'menu-tags';

    if (item.type) {
      const typeTag = document.createElement('span');
      typeTag.className = 'menu-tag';
      typeTag.innerText = item.type;
      tagsDiv.appendChild(typeTag);
    }

    const dietTag = document.createElement('span');
    dietTag.className = 'menu-tag menu-tag--diet';
    if (item.vegan) {
      dietTag.innerText = 'Vegan';
      dietTag.classList.add('menu-tag--vegan');
    } else if (item.vegetarian) {
      dietTag.innerText = 'Vegetarian';
      dietTag.classList.add('menu-tag--vegetarian');
    } else {
      dietTag.innerText = 'Meat';
      dietTag.classList.add('menu-tag--meat');
    }
    tagsDiv.appendChild(dietTag);
    itemDiv.appendChild(tagsDiv);

    // Product Description
    const itemDescription = document.createElement('p');
    itemDescription.innerText = item.description;
    itemDiv.appendChild(itemDescription);

    // Menu Button (Ingredients & Allergens Tooltip)
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.type = 'button';
    menuButton.setAttribute('data-tooltip', `Ingredients:\n${item.ingredients}\n\nAllergens:\n${item.allergens || 'None'}`);

    const buttonLabel = document.createElement('span');
    buttonLabel.innerText = 'Details';
    menuButton.appendChild(buttonLabel);

    // Bottom Row (Details)
    const bottomRow = document.createElement('div');
    bottomRow.className = 'bottom-row';
    bottomRow.appendChild(menuButton);

    // Append bottom row to menu item
    itemDiv.appendChild(bottomRow);

    grid.appendChild(itemDiv);
    });

    menuContainer.appendChild(section);
  });
}

// Load menu immediately
loadMenu();
