import SiteHeader from "@/components/site-header";

interface BookmarksLayoutProps {
  children: React.ReactNode;
}

export default async function BookmarksLayout({
  children,
}: BookmarksLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
