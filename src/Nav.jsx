import "./Nav.css";
import logo from "./mits-logo.png";
function Nav({darkMode,setDarkMode}) {
    return(
        <nav className="navbar">
            <div className="nav-left">
                <img src={logo} alt="logo"></img>
                <h1>FRIP</h1>
            </div>
            <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#features">Features</a>
                <a href="#developer">Developer</a>
            </div>
            <div className="nav-right">
                <div className="theme-toggle">
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️" : "🌙"}
                </button>
                </div>
                <button>Sign In</button>
            </div>
           
        </nav>
    );
}
export default Nav;