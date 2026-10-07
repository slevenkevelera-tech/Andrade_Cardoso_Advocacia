import mauriloPhoto from '../assets/images/partner-maurilo-uploaded-v1.jpg';
import lorenzoPhoto from '../assets/images/partner-lorenzo-uploaded-v1.jpg';
import luanaPhoto from '../assets/images/partner-luana-uploaded-v1.jpg';

// Imported through Vite so production URLs are content-hashed and cannot reuse
// the previous public/static image URLs.
export const PARTNER_PHOTOS = {
  maurilo: mauriloPhoto,
  lorenzo: lorenzoPhoto,
  luana: luanaPhoto,
} as const;
