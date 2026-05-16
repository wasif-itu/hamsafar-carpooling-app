// Wraps the 390px mobile canvas in a styled phone bezel for desktop demo
export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto overflow-hidden bg-background"
      style={{
        width: 390,
        height: '100dvh',
        minHeight: '100vh',
        borderRadius: 40,
        boxShadow: `
          0 0 0 2px #1e293b,
          0 0 0 6px #334155,
          0 40px 100px rgba(0,0,0,0.50)
        `,
      }}
    >
      {/* Notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-slate-900 rounded-b-2xl"
        style={{ width: 120, height: 28 }}
      />
      {children}
    </div>
  );
}
