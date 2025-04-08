import { useEffect, useState, useMemo } from "react";

interface CountdownTimerProps {
    endTime?: Date | string; // Allow endTime to be a Date or string
    onExpire?: () => void;
    className?: string;
}

const CountdownTimer = ({
    endTime = new Date(Date.now() + 10 * 60 * 1000), // Default to 10 minutes from now
    onExpire,
    className,
}: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<{
        minutes: number;
        seconds: number;
    }>({ minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(100);

    // Memoize parsedEndTime to prevent unnecessary re-renders
    const parsedEndTime = useMemo(() => {
        return typeof endTime === "string" ? new Date(endTime) : endTime;
    }, [endTime]);

    // Calculate the initial total duration once (difference between start and end)
    const totalDurationRef = useMemo(() => {
        const startTime = new Date();
        return parsedEndTime.getTime() - startTime.getTime();
    }, [parsedEndTime]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = parsedEndTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ minutes: 0, seconds: 0 });
                setProgress(0);
                onExpire?.();
                return;
            }

            // Calculate progress based on the actual duration
            const newProgress = (difference / totalDurationRef) * 100;
            setProgress(Math.max(0, newProgress));

            const minutes = Math.floor(difference / 60000);
            const seconds = Math.floor((difference % 60000) / 1000);

            setTimeLeft({ minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [parsedEndTime, onExpire, totalDurationRef]);

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
                            strokeDashoffset: `${strokeDashoffset}`,
                        }}
                    />
                </svg>
                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xs font-medium">
                    {timeLeft.minutes.toString().padStart(2, "0")}:
                    {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
            </div>
            <div className="text-xs text-gray-500">
                {progress > 50 ? "Hurry up!" : "Ending soon!"}
            </div>
        </div>
    );
};

export default CountdownTimer;