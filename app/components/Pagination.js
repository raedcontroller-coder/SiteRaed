"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages, currentPage }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={createPageURL(page)}
            style={{
              padding: '8px 16px',
              border: `1px solid ${isCurrent ? 'var(--accent)' : 'var(--border-color)'}`,
              backgroundColor: isCurrent ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
              color: isCurrent ? '#000' : 'var(--text-primary)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: isCurrent ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
            }}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
}
