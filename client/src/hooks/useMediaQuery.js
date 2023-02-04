import { useEffect, useState } from "react"

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const handleChange = (e) => {
            setMatches(e.matches);
        };
        media.addListener(handleChange);

        return () => {
            media.removeListener(handleChange);
        };
    }, [query, matches]);

    return matches;
};

export default useMediaQuery;