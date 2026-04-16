import { ChevronLeft, ChevronRight } from "lucide-react";

export const ITEMS_PER_PAGE = 10;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemName: string;
    itemsPerPage?: number;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemName,
    itemsPerPage = ITEMS_PER_PAGE,
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const from = (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-lexend">
                Hiển thị {from}–{to} / {totalItems} {itemName}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === p
                                ? "bg-[#025D9E] text-white shadow-md shadow-blue-200"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
