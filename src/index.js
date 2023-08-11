import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api';

const lightbox = new SimpleLightbox('.gallery a');

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let currentQuery = '';

loadMoreBtn.style.display = 'none';

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `
    <a href="${image.largeImageURL}" class="gallery-link">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;

  gallery.appendChild(card);
}

function clearGallery() {
  gallery.innerHTML = '';
}

function toggleLoadMoreBtn(visible) {
  loadMoreBtn.style.display = visible ? 'block' : 'none';
}



form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;

  try {
    clearGallery();

    const images = await fetchImages(currentQuery, currentPage);

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    images.forEach((image) => createImageCard(image));

      loadMoreBtn.style.display = 'block';
    Notiflix.Notify.success(`Hooray! We found ${images.length} images.`);

    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  try {
    currentPage++;
    const images = await fetchImages(currentQuery, currentPage);

    if (images.length === 0) {
      toggleLoadMoreBtn(false);
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      return;
    }

    images.forEach((image) => createImageCard(image));

    lightbox.refresh();
    window.scrollBy({
      top: gallery.lastElementChild.getBoundingClientRect().height * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('An error occurred while fetching more images. Please try again later.');
  }
});
