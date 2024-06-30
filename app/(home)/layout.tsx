import SiteFooter from "@/components/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]  flex-1 flex-col">
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
