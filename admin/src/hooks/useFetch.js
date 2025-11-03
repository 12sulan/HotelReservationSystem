import { useEffect, useState } from "react";
import axios from "axios";

function useFetch(url) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const normalizedUrl = url.startsWith("/") ? url : "/" + url;
                const fetchUrl = "http://localhost:8801/api" + normalizedUrl;
                console.log("Fetching:", fetchUrl);
                const res = await axios.get(fetchUrl);
                setData(res.data);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    const refetch = async () => {
        setLoading(true);
        try {
            const normalizedUrl = url.startsWith("/") ? url : "/" + url;
            const fetchUrl = "http://localhost:8801/api" + normalizedUrl;
            const res = await axios.get(fetchUrl);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, loading, error, refetch };
}

export default useFetch;
