import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory confuses root detection.
  turbopack: { root: path.join(__dirname) },
  // The quiz list became the course list in the Forester's Field Kit rebrand.
  async redirects() {
    return [{ source: '/quizzes', destination: '/courses', permanent: false }];
  },
};

export default nextConfig;
