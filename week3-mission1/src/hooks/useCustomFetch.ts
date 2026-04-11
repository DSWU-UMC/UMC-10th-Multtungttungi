import { useEffect, useState } from "react";
import axios from 'axios';

const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
               
                const fullUrl = `https://api.themoviedb.org/3${url}&api_key=${import.meta.env.VITE_TMDB_KEY}`;
                
                const response = await axios.get<T>(fullUrl);
                setData(response.data);
            } catch (error) {
                console.error("Fetch Error:", error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isPending, isError };
};

export default useCustomFetch;