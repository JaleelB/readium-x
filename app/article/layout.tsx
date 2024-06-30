interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default async function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]  flex-1 flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
