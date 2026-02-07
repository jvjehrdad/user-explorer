import { UserExplorer } from "@/components/UserExplorer/UserExplorer";

/**
 * Root page — a Server Component that renders the client-side UserExplorer.
 *
 * We keep this as a thin server component and push all interactivity
 * into UserExplorer ("use client"). This means the page shell is
 * server-rendered for fast initial load, while the interactive parts
 * (search, filtering) run on the client.
 */
export default function Home() {
  return (
    <main>
      <UserExplorer />
    </main>
  );
}
