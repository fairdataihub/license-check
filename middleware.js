import { rewrite } from '@vercel/edge';

export function middleware(request) {
  const url = new URL(request.url);

  console.log("URL is: " + url);
  if (url.pathname.startsWith('/privacy')) {
    console.log("privacy page");
    return rewrite(new URL('/privacy', request.url));
  }

  if (url.pathname.startsWith('/support')) {
    console.log("support page");
    return rewrite(new URL('/support', request.url));
  }
}
