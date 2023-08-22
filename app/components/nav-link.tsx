import { Link, useLocation } from '@remix-run/react';
import { cn } from './ui/lib/utils';
import { cva } from 'class-variance-authority';

const navLinkVariants = cva('whitespace-nowrap focus:outline-none', {
  variants: {
    variant: {
      default: 'text-ht-black',
      active: 'text-ht-black underline',
    },
    position: {
      navbar: '',
      sidebar: 'w-full block',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function NavLink({
  to,
  children,
  onClick,
  className,
  position = 'navbar',
  ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & {
  to: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  position?: 'navbar' | 'sidebar';
}) {
  const location = useLocation();
  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`);

  const variant = isSelected ? (!(position == 'navbar' && to == '/') ? 'active' : 'default') : 'default';

  return (
    <Link
      prefetch='intent'
      className={cn(navLinkVariants({ variant, position, className }))}
      to={to}
      onClick={(e) => typeof onClick === 'function' && onClick(e)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export { NavLink };