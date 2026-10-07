// Partner portraits are served directly from the repository's public image files.
// The version query string intentionally changes when the assets are replaced, preventing stale browser/CDN responses.
const PARTNER_IMAGE_BASE =
  'https://raw.githubusercontent.com/slevenkevelera-tech/Andrade_Cardoso_Advocacia/main/public/images/partners';

export const PARTNER_PHOTOS = {
  maurilo: `${PARTNER_IMAGE_BASE}/maurilo-cardoso.jpg?v=20261007-2`,
  lorenzo: `${PARTNER_IMAGE_BASE}/lorenzo-cardoso.jpg?v=20261007-2`,
  luana: `${PARTNER_IMAGE_BASE}/luana-monteiro.jpg?v=20261007-2`,
} as const;
