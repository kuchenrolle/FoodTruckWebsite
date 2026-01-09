document.addEventListener('DOMContentLoaded', async function() {
  const galleryContainer = document.getElementById('gallery');
  const repo = 'kuchenrolle/FoodTruckWebsite';
  const branch = 'main';

  async function fetchImages(folder) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch images from ${folder}`);
    const files = await response.json();
    return files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file.name));
  }

  try {
    const [foodImages, nonFoodImages] = await Promise.all([
      fetchImages('docs/images/gallery/food'),
      fetchImages('docs/images/gallery/nonfood')
    ]);
    const images = [...foodImages, ...nonFoodImages];

    images.forEach(image => {
      const anchor = document.createElement('a');
      anchor.href = image.download_url;
      anchor.classList.add('gallery-item');

      const img = document.createElement('img');
      img.src = image.download_url;
      img.alt = `Gallery Image ${image.name}`;

      anchor.appendChild(img);
      galleryContainer.appendChild(anchor);
    });

    setupLightbox();
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

  function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      item.addEventListener('click', function(event) {
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

