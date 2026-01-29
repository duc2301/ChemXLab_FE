import { useState, useEffect, useCallback } from "react";
import type { NewsArticle, NewsResponse, NewsCategory } from "../types/newsTypes";
import { NEWS_CATEGORIES } from "../types/newsTypes";
import { fetchChemistryNews, fetchNewsByCategory, getFeaturedArticle } from "../api/blogNewsService";

interface UseChemistryNewsResult {
    articles: NewsArticle[];
    featuredArticle: NewsArticle | null;
    loading: boolean;
    error: string | null;
    selectedCategory: NewsCategory | null;
    categories: NewsCategory[];
    selectCategory: (category: NewsCategory | null) => void;
    loadMore: () => void;
    hasMore: boolean;
    refresh: () => void;
}

/**
 * Custom hook to fetch and manage chemistry news
 * Uses VnExpress RSS for Vietnam news (no rate limits)
 */
export const useChemistryNews = (): UseChemistryNewsResult => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
    const [nextPage, setNextPage] = useState<string | null>(null);

    // Fetch main news (now VnExpress RSS)
    const fetchNews = useCallback(async (category: NewsCategory | null = null, page?: string) => {
        setLoading(true);
        setError(null);

        try {
            let response: NewsResponse;

            if (category) {
                response = await fetchNewsByCategory(category.keywords, page);
            } else {
                response = await fetchChemistryNews(undefined, page);
            }

            if (page) {
                setArticles((prev) => [...prev, ...response.results]);
            } else {
                setArticles(response.results);
            }

            setNextPage(response.nextPage);
        } catch (err) {
            setError("Không thể tải tin tức. Vui lòng thử lại sau.");
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNews(selectedCategory);
    }, [selectedCategory, fetchNews]);

    const selectCategory = useCallback((category: NewsCategory | null) => {
        setSelectedCategory(category);
        setNextPage(null);
    }, []);

    const loadMore = useCallback(() => {
        if (nextPage && !loading) {
            fetchNews(selectedCategory, nextPage);
        }
    }, [nextPage, loading, fetchNews, selectedCategory]);

    const refresh = useCallback(() => {
        setNextPage(null);
        fetchNews(selectedCategory);
    }, [fetchNews, selectedCategory]);

    return {
        articles,
        featuredArticle: getFeaturedArticle(articles),
        loading,
        error,
        selectedCategory,
        categories: NEWS_CATEGORIES,
        selectCategory,
        loadMore,
        hasMore: !!nextPage,
        refresh,
    };
};
