import { ArrowRight, Calendar, ExternalLink, User } from "lucide-react";
import type { NewsArticle } from "../types/newsTypes";

interface NewsCardProps {
    article: NewsArticle;
    variant?: "default" | "featured" | "compact";
}

/**
 * Format date to Vietnamese locale
 */
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

/**
 * News card component for displaying a single article
 */
export const NewsCard = ({ article, variant = "default" }: NewsCardProps) => {
    const placeholderImage = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800";

    if (variant === "featured") {
        return (
            <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-slate-900"
            >
                {/* Background Image */}
                <img
                    src={article.image_url || placeholderImage}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                    <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                            Nổi bật
                        </span>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.pubDate)}</span>
                        </div>
                        {article.source_name && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{article.source_name}</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {article.title}
                    </h2>

                    {article.description && (
                        <p className="text-white/80 text-lg line-clamp-2 max-w-3xl mb-6">
                            {article.description}
                        </p>
                    )}

                    <span className="inline-flex items-center gap-3 text-white font-bold group-hover:gap-5 transition-all">
                        Đọc thêm <ArrowRight className="w-5 h-5" />
                    </span>
                </div>
            </a>
        );
    }

    if (variant === "compact") {
        return (
            <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all"
            >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img
                        src={article.image_url || placeholderImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                        {article.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(article.pubDate)}</span>
                        {article.source_name && <span>• {article.source_name}</span>}
                    </div>
                </div>
            </a>
        );
    }

    // Default variant - Modern Blog Card
    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                <img
                    src={article.image_url || placeholderImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category/Source Tag Overlay */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                        {article.source_name || "Tin tức"}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.pubDate)}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-3">
                    {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {article.description}
                    </p>
                )}

                {/* Footer / Read more */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                    <span className="font-semibold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                        Đọc tiếp
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
            </div>
        </a>
    );
};

export default NewsCard;
