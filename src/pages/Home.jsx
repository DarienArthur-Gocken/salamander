import salamanderImg from '../assets/salamander.jpg';

export default function Home() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden flex flex-col items-center justify-center text-center">

            <h1 className="text-4xl font-bold color-text mb-4">
                Salamander Tracker
            </h1>

            <p className="text-text mb-6">
                Pick a video from the Videos page to start analyzing.
            </p>

            <img
                src={salamanderImg}
                alt="Salamander"
                className="w-full max-w-md rounded-2xl shadow-lg border border-accent" />
        </div>
    );
}