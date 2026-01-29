/**
 * Loading skeleton for news cards
 */

interface NewsSkeletonProps {
    variant?: "default" | "featured" | "compact";
    count?: number;
}

const SkeletonPulse = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const NewsSkeleton = ({ variant = "default", count = 1 }: NewsSkeletonProps) => {
    const skeletons = Array.from({ length: count });

    if (variant === "featured") {
        return (
            <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-[21/9]">
                <div className="h-full w-full flex flex-col justify-end p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-4">
                        <SkeletonPulse className="w-20 h-6 rounded-full" />
                        <SkeletonPulse className="w-32 h-4" />
                    </div>
                    <SkeletonPulse className="w-3/4 h-12 mb-4" />
                    <SkeletonPulse className="w-1/2 h-6 mb-6" />
                    <SkeletonPulse className="w-32 h-8" />
                </div>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <>
                {skeletons.map((_, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100">
                        <SkeletonPulse className="w-24 h-24 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <SkeletonPulse className="w-full h-5" />
                            <SkeletonPulse className="w-3/4 h-5" />
                            <SkeletonPulse className="w-1/2 h-4" />
                        </div>
                    </div>
                ))}
            </>
        );
    }

    // Default variant
    return (
        <>
            {skeletons.map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                    <SkeletonPulse className="aspect-[16/10] rounded-none" />
                    <div className="p-6 space-y-3">
                        <div className="flex gap-3">
                            <SkeletonPulse className="w-24 h-4" />
                            <SkeletonPulse className="w-20 h-4" />
                        </div>
                        <SkeletonPulse className="w-full h-6" />
                        <SkeletonPulse className="w-3/4 h-6" />
                        <SkeletonPulse className="w-full h-4" />
                        <SkeletonPulse className="w-2/3 h-4" />
                        <SkeletonPulse className="w-24 h-5 mt-4" />
                    </div>
                </div>
            ))}
        </>
    );
};

export default NewsSkeleton;
