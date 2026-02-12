import React from 'react';


export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="page-loader-spinner" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
