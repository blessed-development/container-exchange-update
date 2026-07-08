import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-accent text-white px-4">
      <div className="text-center">
        <p className="text-8xl font-black font-mono text-primary mb-4">404</p>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-white/50 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-colors"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}