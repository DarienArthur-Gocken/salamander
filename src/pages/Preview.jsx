import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getThumbnail } from '../mockApi.js';

export default function Preview() {
    const { filename } = useParams();

    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [color, setColor] = useState(null);
    const [tolerance, setTolerance] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getThumbnail(filename)
            .then((data) => {
                setThumbnail(data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [filename]);

    function setColorRange(e) {
        setColor(e.target.value);
        console.log(e.target.value)
    }

    function handleThreshold(e) {
        setTolerance(e.target.value);
        console.log(e.target.value)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text text-center mb-6 pt-8">
                Preview: {filename}
            </h1>

            <div className="bg-secondary rounded-2xl shadow-lg p-6">
                <div className="bg-background/40 rounded-xl h-80 flex items-center justify-center mb-6 overflow-hidden">

                    {loading ? (
                        <p className="text-text font-medium">
                            Loading preview...
                        </p>

                    ) : error ? (
                        <div className="text-center">
                            <p className="text-red-500 font-semibold mb-2">
                                Failed to load thumbnail
                            </p>

                            <p className="text-text/70 text-sm">
                                {error}
                            </p>
                        </div>

                    ) : (
                        <img
                            src={thumbnail}
                            alt={filename}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <input type="color" onChange={setColorRange}></input>
                <input type="range" onChange={handleThreshold}></input>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/videos"
                        className="inline-block px-4 py-2 rounded bg-primary text-white hover:brightness-95 transition">
                        Back to Videos
                    </Link>

                    <Link
                        to={`/export/${filename}`}
                        className="inline-block px-4 py-2 rounded bg-accent text-white hover:brightness-95 transition">
                        Export
                    </Link>
                </div>
            </div>
        </div>
    );
}