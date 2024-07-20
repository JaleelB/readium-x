import SiteHeader from "@/components/site-header";
interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default async function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
