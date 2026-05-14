import { Link } from 'react-router-dom'

export default function Nav() {
    return (
        <nav className="flex justify-center mt-6">
            <div className="flex gap-8 px-6 py-3">
                <Link to="/" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
                    Home
                </Link>

                <Link to="/videos" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
                    Videos
                </Link>

                <Link to="/preview/test.mp4" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
                    Preview
                </Link>

                <Link to="/export" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
                    Export
                </Link>
            </div>
        </nav>
    )
}