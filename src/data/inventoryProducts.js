const gallery = (folder, files) =>
  files.map((file) => '/images/products/' + folder + '/' + file);

const standardGallery = (folder, { interior = true, extras = 0 } = {}) =>
  gallery(folder, [
    'hero.webp',
    'front-view.webp',
    'side-angle.webp',
    'blind-end-angle.webp',
    'representative-1.webp',
    'representative-2.webp',
    ...(interior ? ['interior-1.webp'] : []),
    ...Array.from(
      { length: extras },
      (_, index) => 'extra-' + String(index + 1).padStart(2, '0') + '.webp'
    ),
  ]);

const galleries = {
  'new-20-iicl': standardGallery('new-20-iicl'),
  'new-40-iicl': standardGallery('new-40-iicl', { interior: false }),
  'new-40hc-iicl': standardGallery('new-40hc-iicl', { interior: false }),
  'used-20-iicl': standardGallery('used-20-iicl', { extras: 1 }),
  'used-40-iicl': standardGallery('used-40-iicl'),
  'used-40hc-iicl': standardGallery('used-40hc-iicl'),
  'used-20-cw': standardGallery('used-20-cw', { extras: 1 }),
  'used-40-cw': standardGallery('used-40-cw', { interior: false }),
  'used-40hc-cw': standardGallery('used-40hc-cw', { extras: 1 }),
  'used-20-wwt': standardGallery('used-20-wwt', { interior: false }),
  'used-40-wwt': gallery('used-40-wwt', [
    'hero.webp', 'front-view.webp', 'side-angle.webp',
    'blind-end-angle.webp', 'representative-1.webp', 'interior-1.webp',
    'extra-01.webp', 'extra-02.webp', 'extra-03.webp',
  ]),
  'used-40hc-wwt': standardGallery('used-40hc-wwt'),
  'used-20-as-is': gallery('used-20-as-is', [
    'hero.webp', 'front-view.webp', 'side-angle.webp',
    'representative-1.webp', 'interior-1.webp', 'extra-01.webp',
  ]),
  'used-40-as-is': gallery('used-40-as-is', [
    'hero.webp', 'front-view.webp', 'side-angle.webp',
    'blind-end-angle.webp', 'representative-1.webp', 'interior-1.webp',
    'extra-01.webp',
  ]),
  'used-40hc-as-is': standardGallery('used-40hc-as-is'),
};

const catalog = [
  ['new-20-iicl', 'New 20ft One-Trip Shipping Container | IICL', 'New', 20, 'standard', 'IICL', 2900, 5, 184, false],
  ['new-40-iicl', 'New 40ft One-Trip Shipping Container | IICL', 'New', 40, 'standard', 'IICL', 4750, 4.9, 102, false],
  ['new-40hc-iicl', 'New 40HC One-Trip Shipping Container | IICL', 'New', 40, 'high_cube', 'IICL', 5400, 5, 124, true],
  ['used-20-iicl', 'Used 20ft IICL Shipping Container', 'Used', 20, 'standard', 'IICL', 2350, 4.9, 76, false],
  ['used-40-iicl', 'Used 40ft IICL Shipping Container', 'Used', 40, 'standard', 'IICL', 3350, 5, 88, false],
  ['used-40hc-iicl', 'Used 40HC IICL Shipping Container', 'Used', 40, 'high_cube', 'IICL', 3850, 4.9, 94, false],
  ['used-20-cw', 'Used 20ft Cargo Worthy Shipping Container | CW', 'Used', 20, 'standard', 'CW', 1650, 4.8, 142, false],
  ['used-40-cw', 'Used 40ft Cargo Worthy Shipping Container | CW', 'Used', 40, 'standard', 'CW', 2450, 4.7, 161, false],
  ['used-40hc-cw', 'Used 40HC Cargo Worthy Shipping Container | CW', 'Used', 40, 'high_cube', 'CW', 3150, 4.8, 117, false],
  ['used-20-wwt', 'Used 20ft Wind & Water Tight Shipping Container | WWT', 'Used', 20, 'standard', 'WWT', 1350, 4.9, 207, true],
  ['used-40-wwt', 'Used 40ft Wind & Water Tight Shipping Container | WWT', 'Used', 40, 'standard', 'WWT', 1800, 4.9, 217, true],
  ['used-40hc-wwt', 'Used 40HC Wind & Water Tight Shipping Container | WWT', 'Used', 40, 'high_cube', 'WWT', 2050, 4.8, 198, true],
  ['used-20-as-is', 'Used 20ft As-Is Shipping Container | AS IS', 'Used', 20, 'standard', 'AS_IS', 1150, 4.4, 51, false],
  ['used-40-as-is', 'Used 40ft As-Is Shipping Container | AS IS', 'Used', 40, 'standard', 'AS_IS', 1450, 4.5, 63, false],
  ['used-40hc-as-is', 'Used 40HC As-Is Shipping Container | AS IS', 'Used', 40, 'high_cube', 'AS_IS', 1650, 4.5, 58, false],
];

export const inventoryProducts = catalog.map(
  ([
    id,
    name,
    condition,
    size,
    height,
    grade,
    basePrice,
    rating,
    reviewCount,
    bestseller,
  ]) => ({
    id,
    name,
    condition,
    size,
    height,
    grade,
    base_price: basePrice,
    rating,
    review_count: reviewCount,
    image_url: galleries[id][0],
    gallery_urls: galleries[id].slice(1),
    short_description:
      height === 'high_cube'
        ? 'High Cube \u2022 9ft 6in High'
        : 'Standard Height \u2022 8ft 6in High',
    is_available: true,
    is_bestseller: bestseller,
  })
);
