import { useEffect, useState } from 'react';
import { getVideos } from '../mockApi.js';
import { Link } from 'react-router-dom'

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getVideos()
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <p className="text-text text-center mt-10">
                Loading videos...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-text text-center mt-10">
                Could not load videos: {error}
            </p>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text text-center mb-6">
                Available Videos
            </h1>
            <div className="overflow-hidden rounded-2xl shadow-lg bg-secondary">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="p-4 w-1/12">#</th>
                            <th className="p-4 w-6/12">Filename</th>
                            <th className="p-4 w-2/12 text-center">Preview</th>
                            <th className="p-4 w-3/12 text-center">Latest</th>
                        </tr>
                    </thead>

                    <tbody>
                        {videos.map((filename, index) => (
                            <tr
                                key={filename}
                                className="border-b border-background hover:bg-background/20 transition duration-200">
                                <td className="p-4 text-text font-medium">
                                    {index + 1}
                                </td>

                                <td className="p-4 text-text truncate">
                                    {filename}
                                </td>

                                <td className="p-4 text-center">
                                    <Link
                                        to={`/preview/${filename}`}
                                        className="inline-block px-5 py-2 rounded-full bg-primary text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition">
                                        Preview
                                    </Link>
                                </td>

                                <td className="p-4 text-center">
                                    <Link
                                        to={`/preview/${filename}`}
                                        className=" inline-block px-5 py-2 rounded-full bg-accent text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition">
                                        Latest
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}