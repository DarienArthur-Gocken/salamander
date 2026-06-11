import { useEffect, useState } from 'react';
import { getLatestCsv, getMetadata, getVideos } from '../api.js';
import { Link } from 'react-router-dom'

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [downloadUrls, setDownloadUrls] = useState({});

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

    async function handleLatestCsv(filename) {
        setStatusMessage(`Looking for the latest CSV export for ${filename}…`);

        try {
            const latestCsv = await getLatestCsv(filename);
            const downloadUrl =
                typeof latestCsv === 'string'
                    ? latestCsv
                    : latestCsv?.url || latestCsv?.filepath || latestCsv?.csvUrl || latestCsv?.path;

            if (!downloadUrl) {
                setStatusMessage('No CSV export has been generated for this video yet.');
                return;
            }

            setDownloadUrls((prev) => ({ ...prev, [filename]: downloadUrl }));

            const jobId = downloadUrl.split('/').filter(Boolean).pop();
            if (jobId) {
                try {
                    const metadata = await getMetadata(jobId);
                    const targetColor = metadata.targetColor ? `#${metadata.targetColor}` : 'unknown';
                    const threshold = metadata.threshold ?? 'unknown';
                    setStatusMessage(
                        `Latest CSV ready. Last inputs: color ${targetColor}, threshold ${threshold}.`
                    );
                } catch (metadataErr) {
                    console.warn('Failed to fetch metadata for latest CSV:', metadataErr);
                    setStatusMessage('Latest CSV ready.');
                }
            } else {
                setStatusMessage('Latest CSV ready.');
            }

            window.location.href = downloadUrl;
        } catch (err) {
            console.error('Failed to fetch the latest CSV:', err);
            setStatusMessage(err.message || 'Unable to load the latest CSV export.');
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text text-center mb-6 pt-8">
                Available Videos
            </h1>
            {statusMessage ? (
                <p className="mb-4 rounded-xl border border-background/40 bg-secondary p-4 text-sm text-text/80">
                    {statusMessage}
                </p>
            ) : null}

            <div className="overflow-hidden rounded-2xl shadow-lg bg-secondary">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-text text-white">
                        <tr>
                            <th className="p-4 w-1/12">#</th>
                            <th className="p-4 w-5/12">Filename</th>
                            <th className="p-4 w-3/12 text-center">Preview</th>
                            <th className="p-4 w-3/12 text-center">Latest CSV</th>
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
                                        className="inline-block px-4 py-2 rounded bg-primary text-white hover:brightness-95 transition">
                                        Preview
                                    </Link>
                                </td>
                                <td className="p-4 text-center">
                                    <a
                                        href={downloadUrls[filename] || '#'}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handleLatestCsv(filename);
                                        }}
                                        className="inline-block px-4 py-2 rounded bg-accent text-white hover:brightness-95 transition">
                                        Pull Latest
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}