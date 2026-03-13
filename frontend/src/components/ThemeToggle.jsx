import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Switch to {mode === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;