import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";

/**
 * Minimal ESLint config for TeluguColleges.
 *
 * Next 16 removed the `next lint` command, so we run ESLint standalone.
 * Scope is intentionally narrow — we pull in ONLY the `@next/next/*` rules
 * (core-web-vitals subset) to catch real public-site regressions:
 *   • no-img-element (missing alt, unoptimized <img>)
 *   • no-html-link-for-pages (use <Link> for internal nav)
 *   • no-sync-scripts, no-page-custom-font (perf)
 *   • no-assign-module-variable
 * We deliberately skip the react/ and @typescript-eslint/ rules that the full
 * core-web-vitals preset references — those would require extra plugins and
 * tsc --noEmit already catches their failure modes.
 */

function pickNextRules(rulesObj) {
  return Object.fromEntries(
    Object.entries(rulesObj || {}).filter(([k]) => k.startsWith("@next/next/"))
  );
}

export default [
  {
    ignores: [
      // Generated build output — at the repo root AND nested anywhere (e.g.
      // .claude/worktrees/<id>/.next_old2/). The `**/` variants are required:
      // a bare ".next_old*/" only matches at the root, so without them ESLint
      // descends into worktree build artifacts and fails the lint run.
      ".next/",
      ".next_old/",
      ".next_old*/",
      ".next.stale*/",
      "**/.next/",
      "**/.next_old*/",
      "**/.next.stale*/",
      ".claude/",
      "node_modules/",
      "out/",
      "public/",
      "_reference/",
      "docs/",
      "*.plugin",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    linterOptions: {
      // Source has some inline `react/*` disable comments for when a stricter
      // config is enabled; our current narrow scope makes them "unused", but we
      // keep the comments as defensive hints — silence the resulting noise.
      reportUnusedDisableDirectives: "off",
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@next/next": nextPlugin, react: reactPlugin },
    rules: {
      ...pickNextRules(nextPlugin.configs.recommended.rules),
      ...pickNextRules(nextPlugin.configs["core-web-vitals"].rules),
    },
  },
];
