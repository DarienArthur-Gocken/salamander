import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Export() {
    const { filename } = useParams();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        //FAKE PROGRESS PATCH LATER
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + Math.random() * 15;
            });
        }, 500);

        const completeTimer = setTimeout(() => {
            setProgress(100);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(completeTimer);
        };
    }, []);

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-96">
            <h1 className="text-2xl font-bold text-primary mb-4">Exporting: {filename}</h1>
            {progress < 100 ? (
                <div className="w-full max-w-md">
                    <div className="bg-secondary rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-text text-center mt-4">{Math.min(Math.floor(progress), 100)}% Complete</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-text text-lg">Export Complete!</p>
                    <a
                        href={`/downloads/${filename}`}
                        className="inline-block px-4 py-2 rounded bg-primary text-white hover:brightness-95 transition">
                        Download {filename}.csv
                    </a>
                </div>
            )}
        </div>
    );
}