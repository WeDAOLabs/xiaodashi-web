import Link from 'next/link';
import React from 'react';
import { BreadcrumbItem } from './types';

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav = React.memo<BreadcrumbNavProps>(({ items }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.href && !item.current ? (
            <Link 
              className="text-base font-medium leading-normal text-[var(--text-tertiary)]" 
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`text-base font-medium leading-normal ${
                item.current 
                  ? 'text-[var(--text-primary)]' 
                  : 'text-[var(--text-tertiary)]'
              }`}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-base font-medium leading-normal text-[var(--text-tertiary)]">
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

BreadcrumbNav.displayName = 'BreadcrumbNav';

export default BreadcrumbNav;