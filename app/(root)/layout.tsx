export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        {/* Left Sidebar */}
        {children}
        {/* Right Sidebar */}
      </main>
    </div>
  );
}
