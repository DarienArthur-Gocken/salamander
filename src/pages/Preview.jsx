import { Link, useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { getThumbnail } from '../mockApi.js';

export default function Preview() {
    const { filename } = useParams();

    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [color, setColor] = useState(null);
    const [tolerance, setTolerance] = useState(0);

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [imageReady, setImageReady] = useState(false);


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

    useEffect(() => {
        if (!thumbnail) return;
        setImageReady(false);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imgRef.current = img;
            setImageReady(true);
            //console.log('image loaded:', imgRef.current.naturalWidth, 'x', imgRef.current.naturalHeight)
        };
        img.src = thumbnail;
    }, [thumbnail]);

    useEffect(() => {
        if (!imageReady) return;
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (!img || !canvas) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = data.data;

        function hexToRGB(hex) {
            if (!hex) return [0, 0, 0];

            const clean = hex.replace('#', '');

            const red = parseInt(clean.substring(0, 2), 16);
            const green = parseInt(clean.substring(2, 4), 16);
            const blue = parseInt(clean.substring(4, 6), 16);

            return [red, green, blue];
        }

        function euclideanColorDist(r1, g1, b1, r2, g2, b2) {
            const red = r1 - r2;
            const green = g1 - g2;
            const blue = b1 - b2;

            return Math.sqrt(red * red + green * green + blue * blue);
        }

        for (let i = 0; i < px.length; i += 4) {
            const red = px[i];
            const green = px[i + 1];
            const blue = px[i + 2];

            const [targetRed, targetGreen, targetBlue] = hexToRGB(color);

            const distance = euclideanColorDist(red, green, blue, targetRed, targetGreen, targetBlue);
            if (distance > tolerance) {
                //black
                px[i] = 0;
                px[i + 1] = 0;
                px[i + 2] = 0;
            } else {
                //white
                px[i] = 255;
                px[i + 1] = 255;
                px[i + 2] = 255;
            }
        }

        ctx.putImageData(data, 0, 0);
    }, [imageReady, color, tolerance]);

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

                    <canvas ref={canvasRef} />
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