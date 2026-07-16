import { DependencyList, useEffect, useState } from "react";
import { UseQueryResult } from "../types/common";

function useQuery<T>(queryFn: () => Promise<T>, deps: DependencyList = []): UseQueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = () => setTrigger((prev) => prev + 1);

    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            setIsPending(true);
            setError(null);

            try {
                const result = await queryFn();
                if (isMounted) {
                    setData(result);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || "Something went wrong");
                }
            } finally {
                if (isMounted) {
                    setIsPending(false);
                }
            }
        };

        getData();

        return () => {
            isMounted = false;
        };
    }, [...deps, trigger]);

    return { data, isPending, error, refetch };
}

export default useQuery;
