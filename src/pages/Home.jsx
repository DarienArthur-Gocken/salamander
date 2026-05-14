import salamanderImg from '../assets/salamander.jpg';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
                Salamander Tracker
            </h1>

            <p className="text-gray-600 mb-6">
                Pick a video from the Videos page to start analyzing.
            </p>

            <img
                src={salamanderImg}
                alt="Salamander"
                className="w-full max-w-md rounded-2xl shadow-lg border"
            />
        </div>
    );
}