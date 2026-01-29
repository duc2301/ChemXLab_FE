import type { NewsResponse, NewsArticle } from "../types/newsTypes";
import { DEFAULT_SEARCH_QUERY } from "../types/newsTypes";

// Removed caching logic as we are relying on VnExpress RSS directly for now

/**
 * Fetch chemistry news optimized for virtual lab education
 */
import { fetchVnExpressNews } from "./vnexpressRssService";

// Assuming isNewsApiConfigured is defined elsewhere or needs to be added
// For now, I'll add a placeholder for it to make the snippet syntactically correct.
// In a real scenario, this would come from a configuration service or similar.
const isNewsApiConfigured = () => false; // Placeholder

/**
 * Fetch chemistry news (Now using VnExpress RSS)
 */
export const fetchChemistryNews = async (
    _query: string = DEFAULT_SEARCH_QUERY,
    _page?: string
): Promise<NewsResponse> => {
    // We now prioritize VnExpress RSS which doesn't support query/pagination directly
    // Pagination is handled client-side or we could implement manual slicing if needed
    if (!isNewsApiConfigured()) {
        // Fallback to mock data is now removed, we trust fetchVnExpressNews to return data or empty
        // return getMockNewsData(); 
    }
    // For now, return VnExpress news directly as it's the priority source
    return fetchVnExpressNews();
};

/**
 * Fetch news by specific category
 */
export const fetchNewsByCategory = async (
    keywords: string[],
    _page?: string
): Promise<NewsResponse> => {
    // VnExpress RSS doesn't support complex search, so we fetch all and filter
    const allNews = await fetchVnExpressNews();

    // Simple filter by keywords in title or description
    const filteredResults = allNews.results.filter(article =>
        keywords.some(keyword =>
            article.title.toLowerCase().includes(keyword.toLowerCase()) ||
            article.description?.toLowerCase().includes(keyword.toLowerCase())
        )
    );

    return {
        ...allNews,
        results: filteredResults,
        totalResults: filteredResults.length
    };
};

// Removed getVietnamMockData and fetchVietnamNews as they are replaced by fetchVnExpressNews


/**
 * Fetch latest science events and competitions
 */
export const fetchScienceEvents = async (): Promise<NewsResponse> => {
    return fetchChemistryNews(
        "chemistry olympiad OR chemistry competition OR IChO OR science fair"
    );
};

// Export a function to get featured article (first article)
export const getFeaturedArticle = (articles: NewsArticle[]): NewsArticle | null => {
    return articles.length > 0 ? articles[0] : null;
};


