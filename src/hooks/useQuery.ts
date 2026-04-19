import { useEffect, useState, DependencyList } from "react";
import { UseQueryResult } from "../types/common";

function useQuery<T>(queryFn: () => Promise<T>, deps: DependencyList = []): UseQueryResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
    }, deps);

    return { data, isPending, error };
}

export default useQuery;
