import { Link } from 'react-router-dom'

export default function Nav() {
    return (
        <nav>
            <Link to="/">Home</Link>
            {' | '}
            <Link to="/videos">Videos</Link>
            {' | '}
            <Link to="/preview">Preview</Link>
            {' | '}
            <Link to="/export">Export</Link>
        </nav>
    )
}