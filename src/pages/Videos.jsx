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

                <table className="w-full text-left">

                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Filename</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {videos.map((filename, index) => (
                            <tr
                                key={filename}
                                className="border-b border-background hover:bg-background/20 transition"
                            >
                                <td className="p-4 text-text">
                                    {index + 1}
                                </td>

                                <td className="p-4 text-text">
                                    {filename}
                                </td>

                                <td className="p-4 text-center">
                                    <Link
                                        to={`/preview/${filename}`}
                                        className="
                                            inline-block
                                            px-5 py-2
                                            rounded-full
                                            bg-accent
                                            text-white
                                            font-medium
                                            hover:scale-105
                                            hover:opacity-90
                                            transition
                                        "
                                    >
                                        Preview
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