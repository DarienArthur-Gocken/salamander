export async function getVideos() {
    const res = await fetch('/api/videos');
    if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
    }
    return res.json();
}

export async function getThumbnail(filename) {
    const url = `/thumbnail/${filename}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`No thumbnail for ${filename}`);
    }
    return url;
}

export async function submitProcessingJob(filename, targetColor, threshold, frameInterval) {
    const hex = targetColor.replace('#', '');
    const res = await fetch(
        `/process/${filename}?targetColor=${hex}&threshold=${threshold}&frameInterval=${frameInterval}`,
        { method: 'POST' }
    );
    if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
    }
    return res.json();
}

export async function getJobStatus(jobId) {
    const res = await fetch(`/process/${jobId}/status`);
    if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
    }
    return res.json();
}

export async function getMetadata(jobId) {
    const res = await fetch(`/metadata/${jobId}`);
    if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
    }
    return res.json();
}

export async function getLatestCsv(filename) {
    const encodedFilename = encodeURIComponent(filename);
    const candidates = [`/latest/${encodedFilename}`, `/results/${encodedFilename}`];

    for (const url of candidates) {
        const res = await fetch(url);

        if (!res.ok) {
            if (res.status === 404) {
                continue;
            }

            throw new Error(`Server responded ${res.status}`);
        }

        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.error) {
                continue;
            }
            return data;
        }

        const text = await res.text();
        if (!text || /<!doctype html/i.test(text) || /<html/i.test(text)) {
            continue;
        }

        return text ? { filepath: text, url: text } : null;
    }

    return null;
}