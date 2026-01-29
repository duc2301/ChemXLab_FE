import axios from "axios";

/**
 * NewsData.io API client for fetching chemistry/science news
 * Free tier: 200 requests/day
 * Docs: https://newsdata.io/documentation
 */

const NEWS_API_BASE_URL = "https://newsdata.io/api/1/";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || "";

const newsApi = axios.create({
    baseURL: NEWS_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add API key to all requests
newsApi.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        apikey: NEWS_API_KEY,
    };
    return config;
});

export default newsApi;

// Check if API key is configured
export const isNewsApiConfigured = () => {
    return NEWS_API_KEY && NEWS_API_KEY !== "your_newsdata_api_key_here";
};
