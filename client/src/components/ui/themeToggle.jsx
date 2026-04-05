import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
         className={className} 
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
};


export default ThemeToggle;
