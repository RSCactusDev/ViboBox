export const publicRoutes = [
  '/',
  '/verify-email',
  '/product/box',
  '/cart',
  '/api/cart/add',    // Allow anonymous users to add items to the cart
  '/api/cart/remove', // Allow anonymous users to remove items from the cart
  '/api/cart',  
]

export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/reset-password',

]


export const DEFAULT_LOGIN_REDIRECT = '/settings'

export const apiAuthPrefix = '/api/auth'

