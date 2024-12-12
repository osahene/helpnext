export default function GuestLayout({ children }) {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </>
  );
}
