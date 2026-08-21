/** @type {import('next').NextConfig} */

// GitHub Pages serves this project site from /My-coach, and needs a static
// export. Both are opt-in via GITHUB_PAGES so local dev and other hosts
// (Netlify, Vercel) keep the normal build at the site root.
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(isPages
    ? {
        output: "export",
        basePath: "/My-coach",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
