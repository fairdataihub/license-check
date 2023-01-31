import { rewrite } from '@vercel/edge';

export function middleware(request) {
  console.log("Middleware activated");
  const url = new URL(request.url);

  console.log("URL is: " + url);
  if (url.pathname.includes('privacy')) {
    console.log("privacy page");
    return rewrite(new URL('/privacy.html', request.url));
  }

  if (url.pathname.includes('support')) {
    console.log("support page");
    return rewrite(new URL('/support.html', request.url));
  }
}
