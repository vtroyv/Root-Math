/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The maths library copied into src/lib/cortex has about 70 type errors of its own, and
    // the app imports it, so a type check would stop every build. Run `npx tsc --noEmit`
    // to check our own code: anything outside src/lib/cortex should be clean.
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // the Skill Radar page was renamed Progress on 22 Oct 2026 (src/lib/docs/progress-page.md)
      { source: '/learn/skill-radar', destination: '/learn/progress', permanent: true },
    ];
  },
};

export default nextConfig;
