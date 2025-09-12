import React from 'react';

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    <path
      d="M20 2L21 5L24 6L21 7L20 10L19 7L16 6L19 5L20 2Z"
      transform="scale(0.6) translate(2,2)"
    />
  </svg>
);

export default StarIcon;