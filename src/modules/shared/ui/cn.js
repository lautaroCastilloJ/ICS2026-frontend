// Une clases condicionales: cn('a', cond && 'b', undefined) -> 'a b'.
export const cn = (...classes) => classes.filter(Boolean).join(' ');
