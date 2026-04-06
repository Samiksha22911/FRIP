import { useState } from "react";
import "./App.css";
import Intro from "./Intro.jsx";
import Card from "./Card.jsx";
import Nav from "./Nav.jsx";
function App() {
    const [darkMode, setDarkMode] = useState(false);
    return(

            <div className={darkMode ? "app dark" : "app"} >
            <Nav darkMode={darkMode}
            setDarkMode = {setDarkMode}></Nav>
            
        <Intro></Intro>
        <Card></Card>
        </div>
    );
}
export default App;