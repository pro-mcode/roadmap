/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: false,
  // Shiki uses dynamic imports + WASM (oniguruma) that the App Router
  // webpack server bundling does not handle cleanly. Loading it as an
  // external module from node_modules avoids "type is undefined" errors
  // during Server Component rendering.
  serverExternalPackages: ["shiki"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
