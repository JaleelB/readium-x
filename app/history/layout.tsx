import SiteHeader from "@/components/site-header";

interface HistoryLayoutProps {
  children: React.ReactNode;
}

export default async function HistoryLayout({ children }: HistoryLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[calc(100vh-64px)]">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}
