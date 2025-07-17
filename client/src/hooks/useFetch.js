import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function useFetch (url) {

    const fetchUrl = "http://localhost:8801/api" + url;
    console.log("fetchURL",fetchUrl);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        console.log("newURL", url);
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(fetchUrl);
                setData(res.data);
            } catch (err) {
                setError(err);
            }
            setLoading(false)
        };
        fetchData();
    }, [fetchUrl]);

    const refetch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(fetchUrl);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false)
    };

    return { data, loading, error, refetch }
};


export default useFetch;