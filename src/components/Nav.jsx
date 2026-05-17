import { Link } from 'react-router-dom'

export default function Nav() {
    return (
        <nav className="fixed top-0 left-0 z-10 w-full bg-secondary flex justify-center py-4">
            <div className="flex gap-8 px-8 py-4">
                <Link to="/" className="text-text font-medium hover:text-primary transition duration-300">
                    Home
                </Link>

                <Link to="/videos" className="text-text font-medium hover:text-primary transition duration-300">
                    Videos
                </Link>
            </div>
        </nav>
    )
}