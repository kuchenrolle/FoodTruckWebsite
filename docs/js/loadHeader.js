async function getOrCreateHeader() {
  let header = document.getElementById('header');

  // If it doesn't exist, create it and insert it at the top of the body
  if (!header) {
    header = document.createElement('div');
    header.id = 'header';
    document.body.insertBefore(header, document.body.firstChild);
  }

  return header;
}

async function getOrCreateFooter() {
  let footer = document.getElementsByTagName("footer")[0];

  // If it doesn't exist, create it and insert it at the bottom of the body
  if (!footer) {
    footer = document.createElement('footer');
    document.body.append(footer);
  }

  return footer;
}

async function loadHeader() {
  try {
    const headerResponse = await fetch('navigation.html');

    if (headerResponse.ok) {
      const headerHtml = await headerResponse.text();
      const header = await getOrCreateHeader();
      header.innerHTML = headerHtml;

      const navToggle = document.getElementById('nav-toggle');
      navToggle.addEventListener('click', toggleMenu);

      // Attach event listeners after the header is fully loaded
      attachNavListeners(); // Make sure this is called after the header is loaded

    } else {
      console.error('Error loading header:', headerResponse.statusText);
    }

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function loadFooter() {
  try {
    const footerResponse = await fetch('footer.html');

    if (footerResponse.ok) {
      const footerHtml = await footerResponse.text();
      const footer = await getOrCreateFooter();
      footer.innerHTML = footerHtml;

    } else {
      console.error('Error loading footer:', footerResponse.statusText);
    }

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function toggleMenu() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.toggle('open');
}

// Function to attach event listeners to navigation links
function attachNavListeners() {
  const navLinks = document.querySelectorAll('#nav-menu a');

  navLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent the default page reload

      const url = event.target.getAttribute('href'); // Get the URL to load (e.g., "menu.html")

      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();

          // Create a temporary DOM element to parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');

          // Extract the <main> element from the fetched page
          const newMain = doc.querySelector('main');
          const currentMain = document.querySelector('main');

          if (newMain) {
            // Replace the entire <main> element with the new one, keeping all its attributes, classes, etc.
            currentMain.replaceWith(newMain);
          }

          // Update the page title
          const newTitle = doc.querySelector('title');
          if (newTitle) {
            document.title = newTitle.innerText;
          }

          // Remove any existing inline <script> tags from the old content
          document.querySelectorAll('script.dynamic-script').forEach(script => {
            script.remove();
          });

          // Extract the <script> tags and re-add them dynamically
          const newScripts = doc.querySelectorAll('script');
          newScripts.forEach(script => {
            if (script.src) {
              // If the script has a src, re-append it
              const newScript = document.createElement('script');
              newScript.src = script.src;
              newScript.classList.add('dynamic-script');
              document.body.appendChild(newScript);
            } else {
              // For inline scripts, re-execute them
              const inlineScript = document.createElement('script');
              inlineScript.classList.add('dynamic-script');
              inlineScript.textContent = script.textContent;
              document.body.appendChild(inlineScript);
            }
          });

          // Update the browser URL without refreshing the page
          window.history.pushState(null, '', url);

          // Re-attach navigation link listeners after new content is loaded
          attachNavListeners();

          // resize calendar iframe
          if (url.includes('events')) {
            setIframeHeight(); // Adjust the iframe height after loading the events page
          } else if (url.includes('gallery')) {
            loadGallery(); // Manually call the function to load the gallery
          }

        } else {
          console.error('Failed to load content:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    });
  });
}

function loadGallery() {
  const galleryContainer = document.getElementById('gallery');
  
  if (!galleryContainer) {
    console.error('Gallery container not found.');
    return;
  }
  
  const repo = 'kuchenrolle/FoodTruckWebsite'; // Replace with your GitHub username/repository
  const folder = 'docs/images/gallery'; // Folder path in the repository
  const branch = 'main'; // Branch name (default is main)
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    })
    .then(files => {
      if (!Array.isArray(files)) {
        throw new Error('Invalid data format received.');
      }

      const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file.name));

      // Clear existing gallery items
      galleryContainer.innerHTML = '';

      images.forEach(image => {
        const anchor = document.createElement('a');
        anchor.href = image.download_url; // Use GitHub's download URL
        anchor.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = image.download_url;
        img.alt = `Gallery Image ${image.name}`;

        anchor.appendChild(img);
        galleryContainer.appendChild(anchor);
      });

      // Re-setup lightbox after gallery is loaded
      setupLightbox();
    })
    .catch(error => console.error('Error fetching images:', error));
}

// Lightbox setup
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      lightbox.style.display = 'block';
      lightboxImg.src = this.href;
    });
  });

  document.querySelector('.close').addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target !== lightboxImg) {
      lightbox.style.display = 'none';
    }
  });
}


function setIframeHeight() {
  const iframe = document.querySelector('.styled-calendar-container');
  if (iframe) {
    const deviceWidth = window.innerWidth; // Get device width
    iframe.style.height = `${deviceWidth * 0.7}px`; // Set height to 70% of device width
  }
}


// Call right away
loadHeader();  // Header will be loaded, and then attachNavListeners will be called inside
loadFooter();  // Load footer as before

// Handle browser back/forward button by reloading the page
window.addEventListener('popstate', () => {
  location.reload();
});

// Ensure iframe height is set after the content is loaded
document.addEventListener('DOMContentLoaded', () => {
  setIframeHeight();

  // Recalculate iframe height on window resize to maintain responsiveness
  window.addEventListener('resize', setIframeHeight);
});
