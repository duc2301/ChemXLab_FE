import {
  ChevronRight,
  ExternalLink,
  Filter,
  FlaskConical,
  RefreshCw, Search,
  Sparkles,
  TrendingUp,
  X
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { NewsCategory } from "../../features/blog";
import { NewsCard, NewsSkeleton, useChemistryNews } from "../../features/blog";
import Mascot3 from "../../shared/assets/mascot/3.png";

const BlogPage = () => {
  const {
    articles,
    featuredArticle,
    loading,
    error,
    selectedCategory,
    categories,
    selectCategory,
    refresh,
  } = useChemistryNews();

  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get articles excluding featured for the grid
  const gridArticles = featuredArticle
    ? articles.filter((a) => a.article_id !== featuredArticle.article_id)
    : articles;

  // Filter articles by search query
  const filteredArticles = searchQuery
    ? gridArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : gridArticles;

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Modern Minimal Header */}
      <header className="bg-white border-b border-slate-100 py-8 mb-8 overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              {/* Mascot 3 */}
              <div className="w-[180px] flex-shrink-0">
                <img src={Mascot3} alt="Mascot" className="w-full h-auto drop-shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-500" />
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>ChemXLab Blog</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Tin tức & Góc nhìn
                </h1>
                <p className="text-lg text-slate-500 max-w-lg">
                  Cập nhật tin tức hóa học, công nghệ mới và các nghiên cứu khoa học từ khắp nơi trên thế giới.
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={refresh}
                disabled={loading}
                className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors px-2"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Đang cập nhật..." : "Làm mới dữ liệu"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-slate-700 font-semibold"
          >
            <Filter className="w-4 h-4" />
            Danh mục
            <ChevronRight className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Modern & Clean */}
          <aside className={`
            ${showMobileFilters ? "block" : "hidden"} lg:block
            w-full lg:w-64 flex-shrink-0
            fixed lg:sticky top-28 lg:top-20 left-0 right-0 lg:left-auto lg:right-auto
            bg-white lg:bg-transparent z-10 lg:z-0
            p-4 lg:p-0 max-h-[calc(100vh-7rem)] lg:max-h-[calc(100vh-5rem)]
            overflow-y-auto
            shadow-xl lg:shadow-none border-b lg:border-none border-slate-100
          `}>
            <div className="mb-10">
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-6 px-2">
                Danh mục tin tức
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    selectCategory(null);
                    setShowMobileFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  📰 Tất cả tin tức
                </button>
                {categories.map((cat: NewsCategory) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      selectCategory(cat);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${selectedCategory?.id === cat.id
                      ? "bg-white text-blue-600 shadow-md border border-slate-100"
                      : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                      {cat.nameVi}
                    </span>
                    {selectedCategory?.id === cat.id && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Links - Minimalist */}
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-6 px-2">
                Khám phá
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Phòng thí nghiệm ảo", link: "/lab", icon: "🧪", color: "text-purple-600", bg: "bg-purple-50" },
                  { title: "Bảng tuần hoàn", link: "/periodic-table", icon: "⚛️", color: "text-blue-600", bg: "bg-blue-50" },
                  { title: "Thư viện phân tử", link: "/library", icon: "🧬", color: "text-rose-600", bg: "bg-rose-50" },
                ].map((item) => (
                  <Link
                    key={item.link}
                    to={item.link}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center text-sm`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Featured Article */}
            {featuredArticle && !searchQuery && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h2 className="font-bold text-slate-900">Nổi bật</h2>
                </div>
                <a
                  href={featuredArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {featuredArticle.image_url && (
                      <div className="md:w-1/2">
                        <img
                          src={featuredArticle.image_url}
                          alt=""
                          className="w-full h-48 md:h-64 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80";
                          }}
                        />
                      </div>
                    )}
                    <div className="md:w-1/2 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                          {featuredArticle.source_name}
                        </span>
                        <span>•</span>
                        <span>{formatDate(featuredArticle.pubDate)}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-slate-600 line-clamp-2 mb-4">
                        {featuredArticle.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                        Đọc tiếp <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              </section>
            )}

            {/* Articles Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  {searchQuery
                    ? `Kết quả tìm kiếm "${searchQuery}"`
                    : selectedCategory
                      ? selectedCategory.nameVi
                      : "Tin tức mới nhất"}
                </h2>
                <span className="text-sm text-slate-500">
                  {filteredArticles.length} bài viết
                </span>
              </div>

              {loading && gridArticles.length === 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <NewsSkeleton variant="default" count={6} />
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <NewsCard key={article.article_id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-600 mb-2">
                    {searchQuery ? "Không tìm thấy kết quả" : "Không có bài viết"}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {searchQuery
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Thử chọn danh mục khác hoặc làm mới trang"}
                  </p>
                </div>
              )}
            </section>

            {/* Newsletter */}
            <section className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-2">📧 Đăng ký nhận tin</h3>
              <p className="text-slate-300 mb-6 max-w-md mx-auto">
                Cập nhật tin tức hóa học và cuộc thi Olympic mỗi tuần
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition-colors">
                  Đăng ký
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
