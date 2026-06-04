import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-10 shadow-2xl shadow-black/10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">404 - Not Found</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight">Page not found</h1>
        <p className="mt-4 text-base text-muted-foreground leading-7">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex mt-8 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
