import React from "react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePathName: string;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePathName,
}) => {
  return (
    <nav
      className="articles-navigation d-flex justify-content-between align-items-center"
      aria-label="..."
    >
      <Link
        href={`${basePathName}/${+currentPage > 1 ? +currentPage - 1 : 1}`}
        className={`btn-small-white pagination-back ${+currentPage === 1 ? 'disabled' : ''}`}
        aria-disabled={+currentPage === 1}
      >
        Back
      </Link>
      <ul className="pagination d-none d-md-flex">
        {[...Array(totalPages).keys()].map((page, index) => (
          <li
            className={`page-item ${+currentPage === index + 1 ? "active" : ""}`}
            key={index}
          >
            <Link className="page-link" href={`${basePathName}/${index + 1}`}>
              {index + 1}
              {+currentPage === index + 1 && (
                <span className="sr-only">(current)</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`${basePathName}/${+currentPage < totalPages ? +currentPage + 1 : totalPages}`}
        className={`btn-small-white pagination-next ${+currentPage === totalPages ? 'disabled' : ''}`}
        aria-disabled={+currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  );
};