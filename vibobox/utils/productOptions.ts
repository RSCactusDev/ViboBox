// utils/productOptions.ts
export const productOptions = {
  variants: {
    boxWithQR: {
      name: 'Box with QR code',
      price: 14.98,
    },
    digital: {
      name: 'Digital (Link only)',
      price: 6.99,
    },
    bundleX5: {
      name: 'Bundle: 5X Box with QR code',
      price: 37.86,
    },
    bundleX10: {
      name: 'Bundle: 10X Box with QR code',
      price: 55.71,
    },
  },
  availableColors: ['Red', 'Blue', 'Green'],  // Only relevant for physical boxes
};
