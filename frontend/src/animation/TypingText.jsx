import { useEffect, useState } from "react";

const TypingText = ({ text }) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;

        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i));
            i++;

            if (i > text.length) clearInterval(interval);
        }, 20); // speed control

        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayed}</span>;
};

export default TypingText;