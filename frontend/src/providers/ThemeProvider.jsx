import { useSelector } from "react-redux";
import { useEffect } from "react";

const ThemeProvider = ({ children }) => {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return children;
};

export default ThemeProvider;