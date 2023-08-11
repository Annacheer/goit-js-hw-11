import axios from 'axios';

const API_KEY = '38764161-33ef2e0b129eb594e9cec79f2';

export async function fetchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    return response.data.hits;
  } catch (error) {
    throw error;
  }
}
