import React from 'react';


function SkeletonLoader({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <SkeletonLoader height="160px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
      <div className="skeleton-card-body">
        <SkeletonLoader width="70%" height="16px" />
        <SkeletonLoader width="100%" height="12px" />
        <SkeletonLoader width="45%" height="12px" />
        <div className="skeleton-card-footer">
          <SkeletonLoader width="80px" height="28px" borderRadius="var(--radius-full)" />
          <SkeletonLoader width="60px" height="14px" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
