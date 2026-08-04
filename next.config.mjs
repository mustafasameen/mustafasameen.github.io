/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node server there).
  output: "export",
  images: {
    // GitHub Pages can't run Next's image optimizer.
    unoptimized: true,
  },
};

export default nextConfig;
