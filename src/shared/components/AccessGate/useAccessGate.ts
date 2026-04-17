import { useEffect, useState } from "react";
import { GetMySubscription } from "../../../features/Profile";

export type AccessStatus =
    | "loading"
    | "unauthenticated"
    | "no-subscription"
    | "authorized";

export const useAccessGate = (): AccessStatus => {
    const [status, setStatus] = useState<AccessStatus>("loading");

    useEffect(() => {
        let cancelled = false;

        const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
        if (!token) {
            setStatus("unauthenticated");
            return;
        }

        (async () => {
            const subs = await GetMySubscription();
            if (cancelled) return;
            const now = Date.now();
            const hasActive = subs.some(
                (s) =>
                    s.isActive === true &&
                    (!s.endDate || new Date(s.endDate).getTime() > now)
            );
            setStatus(hasActive ? "authorized" : "no-subscription");
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return status;
};
