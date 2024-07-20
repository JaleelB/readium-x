import SiteHeader from "@/components/site-header";

interface HistoryLayoutProps {
  children: React.ReactNode;
}

export default async function HistoryLayout({ children }: HistoryLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
