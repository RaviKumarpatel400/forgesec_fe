import type { NextConfig } from "next";

const routeGroups = {
  products: ["network-scanner", "hybrid-scanner", "remediation-guidance", "risk-prioritization"],
  solutions: ["attack-surface-security", "automated-pentesting", "vulnerability-validation", "security-teams", "hybrid-environments"],
  resources: ["resource-center", "documentation", "blog", "webinars", "help-center", "insights"],
  company: ["about", "about-forge-sec", "team", "careers", "trust", "trust-center", "customers", "reviews", "contact", "newsroom", "partners"]
} as const;

const groupedRoutes = Object.entries(routeGroups).flatMap(([group, slugs]) =>
  slugs.map((slug) => ({ group, slug }))
);

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["172.168.2.39", "172.168.2.39:3000","172.168.1.139","172.168.1.139:3000"],
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...groupedRoutes.flatMap(({ group, slug }) => [
        {
          source: `/work-in-progress/${slug}`,
          destination: `/${group}/${slug}`,
          permanent: true
        },
        ...(["network-scanner", "hybrid-scanner"].includes(slug) ? [] : [{
          source: `/${slug}`,
          destination: `/${group}/${slug}`,
          permanent: true
        }])
      ]),
      {
        source: "/work-in-progress/:slug",
        destination: "/:slug",
        permanent: true
      }
    ];
  },
  async rewrites() {
    const backendOrigin = process.env.BACKEND_API_ORIGIN?.trim().replace(/\/+$/, "");
    if (!backendOrigin || !/^https?:\/\//i.test(backendOrigin)) {
      throw new Error("BACKEND_API_ORIGIN must be a valid HTTP(S) origin in .env.local.");
    }

    return [
      {
        source: "/backend/:path*",
        destination: `${backendOrigin}/:path*`
      },
      ...groupedRoutes.map(({ group, slug }) => ({
        source: `/${group}/${slug}`,
        destination: `/work-in-progress/${slug}`
      }))
    ];
  }
};

export default nextConfig;
