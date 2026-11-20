// client/src/components/ihm/IhmViewportSimulator.jsx

export default function IhmViewportSimulator({ children }) {
  return (
    <div className="w-full max-w-5xl mx-auto transition-all duration-300">
      {children}
    </div>
  );
}
