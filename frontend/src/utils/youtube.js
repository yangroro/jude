import axios from 'axios';
import { API_KEY } from '../appInfo';

const fetch = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// API Documentation: https://developers.google.com/youtube/v3/docs/search/list
export function search(query) {
  return fetch.get('search', {
    params: {
      q: query,
      part: 'snippet',
      type: 'video',
      key: API_KEY,
    },
  })
    .then(res => res.data);
}
