import React, { useState, useEffect, createContext, useContext } from "react";
import toast from "react-hot-toast";

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
});


export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");


const applyTheme = (theme) => {
    const root = document.documentElement;

    if (theme === 'light') {
        root.style.setProperty('--accent', 'var(--light-accent)');
        root.style.setProperty('--accent-2', 'var(--light-accent-2)');
        root.style.setProperty('--accent-3', 'var(--light-accent-3)');
        root.style.setProperty('--background', 'var(--light-background)');
        root.style.setProperty('--background-2', 'var(--light-background-2)');
        root.style.setProperty('--background-3', 'var(--light-background-3)');
        root.style.setProperty('--text', 'var(--light-text)');
        root.style.setProperty('--text-hover', 'var(--light-text-hover)');
    }
    else if (theme === 'dark') {
        root.style.setProperty('--accent', 'var(--dark-accent)');
        root.style.setProperty('--accent-2', 'var(--dark-accent-2)');
        root.style.setProperty('--accent-3', 'var(--dark-accent-3)');
        root.style.setProperty('--background', 'var(--dark-background)');
        root.style.setProperty('--background-2', 'var(--dark-background-2)');
        root.style.setProperty('--background-3', 'var(--dark-background-3)');
        root.style.setProperty('--text', 'var(--dark-text)');
        root.style.setProperty('--text-hover', 'var(--dark-text-hover)');
    }
};

useEffect(() => {
    console.log("Applying theme");
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
}, []);

const toggleTheme = () => {
    console.log("Toggling theme");
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
};

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;