import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getJobStatus } from '../api.js';

export default function Export() {
    const { jobId } = useParams();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [downloadPath, setDownloadPath] = useState(null);
    const [statusMessage, setStatusMessage] = useState('Preparing your export…');

    useEffect(() => {
        if (!jobId) return undefined;

        const interval = setInterval(async () => {
            try {
                const status = await getJobStatus(jobId);
                const nextProgress = Number(status.progress || 0);
                setProgress(nextProgress);
                setStatusMessage(status.message || 'Processing your detection run…');

                const filepath =
                    typeof status.result === 'string'
                        ? status.result
                        : status.result?.filepath || status.csvUrl;

                if (filepath) {
                    setDownloadPath(filepath);
                }

                if (status.status === 'error' || status.complete === false) {
                    setError(status.error || 'Job failed');
                    setStatusMessage('Processing stopped with an error.');
                    clearInterval(interval);
                    return;
                }

                if (status.status === 'done' || status.complete) {
                    setProgress(100);
                    setStatusMessage('Export is ready.');
                    clearInterval(interval);
                }
            } catch (err) {
                console.error('Failed to get job status:', err);
                setError(err.message || 'Unable to fetch job status.');
                setStatusMessage('Unable to keep polling the job status.');
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [jobId]);

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-[70vh] flex flex-col gap-6">
            <div className="rounded-3xl bg-secondary p-6 shadow-lg border border-background/40">
                <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">Processing status</p>
                <h1 className="text-3xl font-bold text-text mt-2">Tracking job {jobId}</h1>
                <p className="text-text/80 mt-3">{statusMessage}</p>
            </div>

            <section className="rounded-3xl bg-secondary p-6 shadow-lg border border-background/40">
                    {error ? (
                        <div className="text-center py-6">
                            <p className="text-red-700 font-semibold mb-2">Export Failed</p>
                            <p className="text-text/70 text-sm">{error}</p>
                        </div>
                    ) : progress < 100 ? (
                        <div className="space-y-4">
                            <div className="bg-background/40 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                                />
                            </div>
                            <p className="text-text text-center text-sm">{Math.min(Math.floor(progress), 100)}% complete</p>                       </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <p className="text-text text-xl font-semibold">Export Complete!</p>
                            <p className="text-text/70 text-sm">The final CSV is ready for download.</p>
                            <a
                                href={downloadPath ?? `/download/${jobId}`}
                                className="inline-block px-4 py-2 rounded bg-primary text-white hover:brightness-95 transition"
                            >
                                Download Result
                            </a>
                        </div>
                    )}
                </section>
        </div>
    );
}