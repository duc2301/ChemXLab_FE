/**
 * NewsData.io API Response Types
 * Optimized for Virtual Chemistry Lab - Vietnam Market
 */

export interface NewsArticle {
    article_id: string;
    title: string;
    link: string;
    keywords: string[] | null;
    creator: string[] | null;
    video_url: string | null;
    description: string | null;
    content: string | null;
    pubDate: string;
    image_url: string | null;
    source_id: string;
    source_priority: number;
    source_name: string;
    source_url: string;
    source_icon: string | null;
    language: string;
    country: string[];
    category: string[];
    ai_tag: string | null;
    sentiment: string | null;
    sentiment_stats: string | null;
    ai_region: null;
}

export interface NewsResponse {
    status: string;
    totalResults: number;
    results: NewsArticle[];
    nextPage: string | null;
}

export interface NewsCategory {
    id: string;
    name: string;
    nameVi: string;
    keywords: string[];
    icon: string;
    color: string;
    description?: string;
}

/**
 * Categories optimized for Virtual Chemistry Lab Vietnam
 * Focused on: Education, Experiments, Competitions, Vietnam news
 */
export const NEWS_CATEGORIES: NewsCategory[] = [
    // Spotlight & Trending
    {
        id: "spotlight",
        name: "Spotlight",
        nameVi: "Tiêu điểm",
        keywords: ["nổi bật", "hot", "xem nhiều", "quan tâm"],
        icon: "🔥",
        color: "from-red-500 to-orange-500",
        description: "Tin tức nổi bật nhất trong ngày",
    },
    // Employment & Career
    {
        id: "jobs",
        name: "Jobs & Career",
        nameVi: "Việc làm",
        keywords: ["việc làm", "tuyển dụng", "nhân sự", "lương", "nghề nghiệp", "thực tập"],
        icon: "💼",
        color: "from-slate-600 to-slate-800",
        description: "Thông tin tuyển dụng và cơ hội nghề nghiệp",
    },
    // Tech: Digital, AI, Devices
    {
        id: "digital-ai",
        name: "Digital Transformation & AI",
        nameVi: "CĐS & AI",
        keywords: ["AI", "trí tuệ nhân tạo", "chuyển đổi số", "blockchain", "công nghệ số", "chatgpt"],
        icon: "🤖",
        color: "from-indigo-600 to-indigo-800",
        description: "Xu hướng công nghệ, AI và chuyển đổi số",
    },
    {
        id: "devices",
        name: "Devices & Tech",
        nameVi: "Thiết bị số",
        keywords: ["điện thoại", "laptop", "iphone", "samsung", "công nghệ", "gadget", "phần cứng"],
        icon: "📱",
        color: "from-cyan-600 to-cyan-800",
        description: "Review thiết bị và sản phẩm công nghệ mới",
    },
    // Nature & Environment
    {
        id: "nature-env",
        name: "Nature & Environment",
        nameVi: "TN & Môi trường",
        keywords: ["môi trường", "khí hậu", "thiên nhiên", "động vật", "sinh vật", "biến đổi khí hậu", "xanh"],
        icon: "🌿",
        color: "from-green-600 to-emerald-800",
        description: "Thế giới tự nhiên và bảo vệ môi trường",
    },
    // Education & Chemistry (Keep generic chemistry topics)
    {
        id: "education",
        name: "Education",
        nameVi: "Giáo dục",
        keywords: ["giáo dục", "tuyển sinh", "đại học", "học bổng", "du học", "điểm thi"],
        icon: "🎓",
        color: "from-blue-600 to-blue-800",
        description: "Tin tức giáo dục và tuyển sinh",
    },
    {
        id: "experiments",
        name: "Experiments",
        nameVi: "Thí nghiệm",
        keywords: ["thí nghiệm", "phản ứng", "hóa học", "chemistry", "lab"],
        icon: "🧪",
        color: "from-purple-600 to-purple-800",
        description: "Khám phá các thí nghiệm khoa học",
    },
    // International Chemistry
    {
        id: "international",
        name: "Int'l Chemistry",
        nameVi: "Quốc tế",
        keywords: ["chemistry world", "research", "international", "science", "uk"],
        icon: "🌍",
        color: "from-blue-700 to-indigo-900",
        description: "Tin tức hóa học quốc tế (Chemistry World)",
    },
];

/**
 * Default search query - Vietnamese keywords for better local results
 */
export const DEFAULT_SEARCH_QUERY = "hóa học";

/**
 * Vietnam-specific search query
 */
export const VIETNAM_SEARCH_QUERY = "khoa học";

