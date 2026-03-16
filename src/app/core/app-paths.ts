const AUTH_ROOT = 'auth';
const ADMIN_ROOT = 'administration';
const PRODUCTS_ROOT = 'products';

export const PATHS = {
  AUTH: {
    ROOT: AUTH_ROOT,
    LOGIN: `${AUTH_ROOT}/login`,
    REGISTER: `${AUTH_ROOT}/register`,
  },
  ADMIN: {
    ROOT: ADMIN_ROOT,
    DASHBOARD: `${ADMIN_ROOT}/dashboard`,
  },
  PRODUCTS: {
    ROOT: PRODUCTS_ROOT,
    DETAIL: (id: string | number) => `${PRODUCTS_ROOT}/product/${id}`,
  },
} as const;
