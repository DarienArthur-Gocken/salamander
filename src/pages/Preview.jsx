import { Link, useParams } from 'react-router-dom';

export default function Preview() {
    const { filename } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Preview: {filename}</h1>
            <p className="text-text mb-4">Thumbnail and tuning controls will go here in a future pair program.</p>
            <Link to={`/export/${filename}`} className="text-text hover:text-primary">Export</Link>
            <Link to="/videos" className="text-text hover:text-primary">Back to videos</Link>
        </div>
    );
}