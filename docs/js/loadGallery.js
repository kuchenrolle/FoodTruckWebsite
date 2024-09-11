document.addEventListener('DOMContentLoaded', async function() {
    const galleryContainer = document.getElementById('gallery');
    const repo = 'kuchenrolle/FoodTruckWebsite'; // Replace with your GitHub username/repository
    const folder = 'docs/images/gallery'; // Folder path in the repository
    const branch = 'main'; // Branch name (default is main)
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}?ref=${branch}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch images from GitHub API');
  
      const files = await response.json();
      const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file.name));
  
      // Dynamically create gallery items for each image
      images.forEach(image => {
        const anchor = document.createElement('a');
        anchor.href = image.download_url; // Use GitHub's download URL for the image
        anchor.classList.add('gallery-item');
  
        const img = document.createElement('img');
        img.src = image.download_url;
        img.alt = `Gallery Image ${image.name}`;
  
        anchor.appendChild(img);
        galleryContainer.appendChild(anchor);
      });
  
      // Add lightbox functionality
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
  