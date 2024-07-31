import SiteHeader from "@/components/site-header";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default async function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex h-[calc(100vh-64px)]">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}
