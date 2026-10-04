const configuredSiteUrl = import.meta.env.VITE_SITE_URL || 'https://containersexchange.com';

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, '');

export const toAbsoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;

  return new URL(path.startsWith('/') ? path : `/${path}`, `${SITE_URL}/`).toString();
};

export const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
