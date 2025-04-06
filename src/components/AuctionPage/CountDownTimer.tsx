import { useEffect, useState } from "react";

interface CountdownTimerProps {
    endTime: Date;
    onExpire?: () => void;
    className?: string;
}

const CountdownTimer = ({ endTime, onExpire, className }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<{
        minutes: number;
        seconds: number;
    }>({ minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = endTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ minutes: 0, seconds: 0 });
                onExpire?.();
                return;
            }

            // Calculate full duration (10 minutes in milliseconds)
            const fullDuration = 10 * 60 * 1000;
            // Calculate elapsed time
            const elapsed = fullDuration - difference;
            // Calculate progress percentage (inversely)
            const newProgress = 100 - (elapsed / fullDuration) * 100;

            setProgress(Math.max(0, newProgress));

            const minutes = Math.floor(difference / 60000);
            const seconds = Math.floor((difference % 60000) / 1000);

            setTimeLeft({ minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTime, onExpire]);

    const strokeDashoffset = 440 - (440 * progress) / 100;

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className="relative w-12 h-12">
                <svg className="w-12 h-12 rotate-[-90deg]" viewBox="0 0 160 160">
                    <circle
                        className="text-gray-200"
                        cx="80"
                        cy="80"
                        r="70"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                    />
                    <circle
                        className="text-primary"
                        cx="80"
                        cy="80"
                        r="70"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: "440",
                            strokeDashoffset: `${strokeDashoffset}`
                        }}
                    />
                </svg>
                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xs font-medium">
                    {timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                </div>
            </div>
            <div className="text-xs text-gray-500">
                {progress > 50 ? "Hurry up!" : "Ending soon!"}
            </div>
        </div>
    );
};

export default CountdownTimer;
