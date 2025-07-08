import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage <= 3) {
                // Show pages 2-4, then ellipsis, then last page
                pages.push(2, 3, 4);
                if (totalPages > 5) pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show ellipsis, then last 4 pages
                pages.push('...');
                pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Show ellipsis, current page and neighbors, ellipsis, last page
                pages.push('...');
                pages.push(currentPage - 1, currentPage, currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                className="px-2 py-1 text-gray-500 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                &lt;
            </button>
            {getPages().map((page, idx) =>
                page === '...'
                    ? <span key={idx} className="px-2">...</span>
                    : <button
                        key={idx}
                        className={`px-2 py-1 rounded ${page === currentPage ? 'font-bold text-primary-600' : 'text-gray-700'}`}
                        onClick={() => onPageChange(page)}
                        disabled={page === currentPage}
                    >
                        {page}
                    </button>
            )}
            <button
                className="px-2 py-1 text-gray-500 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;