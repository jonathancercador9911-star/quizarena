export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#13111A] flex flex-col">
      {children}
    </div>
  );
}
