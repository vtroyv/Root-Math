/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // the Skill Radar page was renamed Progress on 22 Oct 2026 (src/lib/docs/progress-page.md)
      { source: '/learn/skill-radar', destination: '/learn/progress', permanent: true },
    ];
  },
};

export default nextConfig;
