import { Link, useParams, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { getThumbnail, submitProcessingJob } from '../api.js';

export default function Preview() {
    const { filename } = useParams();
    const navigate = useNavigate();

    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [color, setColor] = useState('#000000');
    const [tolerance, setTolerance] = useState(0);
    const [exporting, setExporting] = useState(false);

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [imageReady, setImageReady] = useState(false);

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

    /**
    * Finds the largest connected white region in the binary image
    * and calculates its centroid.
    *
    * Uses Breadth-First Search (BFS) to identify connected groups
    * of white pixels and returns the center point of the largest group.
    *
    * @param {ImageData} data image pixel data
    * @param {number} width image width
    * @param {number} height image height
    * @returns {{x:number, y:number, size:number}|null}
    */
    function findLargestWhiteRegion(data, width, height) {
        const px = data.data;
        const visited = new Set();
        let largestGroup = [];

        function getKey(x, y) {
            return `${x},${y}`;
        }

        function isWhite(x, y) {
            const index = (y * width + x) * 4;

            return (
                px[index] === 255 &&
                px[index + 1] === 255 &&
                px[index + 2] === 255
            );
        }

        function bfs(startX, startY) {
            const queue = [[startX, startY]];
            const group = [];

            visited.add(getKey(startX, startY));

            while (queue.length > 0) {
                const [x, y] = queue.shift();
                group.push([x, y]);

                const neighbors = [
                    [x + 1, y],
                    [x - 1, y],
                    [x, y + 1],
                    [x, y - 1]
                ];

                for (const [nx, ny] of neighbors) {
                    if (
                        nx >= 0 &&
                        nx < width &&
                        ny >= 0 &&
                        ny < height &&
                        !visited.has(getKey(nx, ny)) &&
                        isWhite(nx, ny)
                    ) {
                        visited.add(getKey(nx, ny));
                        queue.push([nx, ny]);
                    }
                }
            }
            return group;
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const key = getKey(x, y);

                if (!visited.has(key) && isWhite(x, y)) {
                    const group = bfs(x, y);

                    if (group.length > largestGroup.length) {
                        largestGroup = group;
                    }
                }
            }
        }

        if (largestGroup.length === 0) {
            return null;
        }

        let totalX = 0;
        let totalY = 0;

        for (const [x, y] of largestGroup) {
            totalX += x;
            totalY += y;
        }

        return {
            x: Math.floor(totalX / largestGroup.length),
            y: Math.floor(totalY / largestGroup.length),
            size: largestGroup.length
        }
    }

    /**
    * Draws a centroid marker on the canvas at the
    * specified x and y coordinates.
    *
    * @param {CanvasRenderingContext2D} ctx canvas drawing context
    * @param {{x:number, y:number}} centroid centroid coordinates
    */
    function drawCentroidDot(ctx, centroid) {
        ctx.beginPath();
        ctx.arc(centroid.x, centroid.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    /**
    * Loads the selected thumbnail image and stores it
    * for use in the preview canvas.
    */
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

    /**
    * Updates the preview whenever the selected color
    * or tolerance changes.
    *
    * Converts the image into a black-and-white binary image,
    * identifies the largest connected region, and displays
    * a centroid marker over the detected object.
    */
    useEffect(() => {
        if (!thumbnail) return;

        setImageReady(false);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            imgRef.current = img;
            setImageReady(true);
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

        const [targetRed, targetGreen, targetBlue] = hexToRGB(color);

        for (let i = 0; i < px.length; i += 4) {
            const red = px[i];
            const green = px[i + 1];
            const blue = px[i + 2];

            const distance = euclideanColorDist(
                red,
                green,
                blue,
                targetRed,
                targetGreen,
                targetBlue
            );

            if (distance > tolerance) {
                px[i] = 0;
                px[i + 1] = 0;
                px[i + 2] = 0;
            } else {
                px[i] = 255;
                px[i + 1] = 255;
                px[i + 2] = 255;
            }
        }

        ctx.putImageData(data, 0, 0);

        const centroid = findLargestWhiteRegion(
            data,
            canvas.width,
            canvas.height
        );

        if (centroid) {
            drawCentroidDot(ctx, centroid);
        }
    }, [imageReady, color, tolerance]);

    /**
    * Updates the selected target color used when
    * generating the binary preview image.
    */
    function setColorRange(e) {
        setColor(e.target.value);
        console.log(e.target.value);
    }

    /**
    * Updates the tolerance value used to determine
    * which pixels are considered part of the target color.
    */
    function handleThreshold(e) {
        setTolerance(Number(e.target.value));
        console.log(e.target.value);
    }

    /**
    * Starts a processing job using the selected
    * color and tolerance settings and navigates
    * to the export page.
    */
    async function handleExport() {
        setExporting(true);

        try {
            const result = await submitProcessingJob(filename, color, tolerance);
            navigate(`/export/${result.jobId}`);
        } catch (err) {
            console.error('Failed to start export:', err);
            setExporting(false);
        }
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
                            className="w-1/2 h-full object-cover transition-opacity duration-500"/>
                    )}

                    <canvas
                        ref={canvasRef}
                        className="w-1/2 h-full transition-opacity duration-500"/>
                </div>

                <h2 className="text-lg font-semibold text-text mb-4">
                    Image Settings
                </h2>

                <div className="flex items-end gap-6">
                    <label className="flex items-center gap-3">
                        <input
                            type="color"
                            value={color}
                            onChange={setColorRange}
                            className="w-14 h-10 cursor-pointer rounded-md border border-text/20 bg-white p-1"/>
                    </label>

                    <label className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-text/60">
                                {tolerance}
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={tolerance}
                            onChange={handleThreshold}
                            className="w-full cursor-pointer accent-primary"/>
                    </label>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <Link
                        to="/videos"
                        className="inline-block px-4 py-2 rounded bg-primary text-white hover:brightness-95 transition">
                        Back to Videos
                    </Link>

                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="inline-block px-4 py-2 rounded bg-accent text-white hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {exporting ? 'Starting Export...' : 'Export'}
                    </button>
                </div>
            </div>
        </div>
    )
}