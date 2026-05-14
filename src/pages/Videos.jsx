import { useEffect, useState } from 'react';
import { getVideos } from '../mockApi.js';
import { Link } from 'react-router-dom'

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getVideos().then((data) => {
            setVideos(data)
            setLoading(false)

        }).catch((err) => {
            setError(err.message);
            setLoading(false);
        });;
    }, []);

    if (loading) {
        return <p className="text-text">Loading videos...</p>;
    }

    if (error) {
        return <p className="text-text">Could not load videos: {error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Available Videos</h1>
            <ul className="list-disc pl-5">
                {videos.map((filename) => (
                    <li key={filename} className="mb-2">
                        <Link to={`/preview/${filename}`} className="text-text hover:text-primary">{filename}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}