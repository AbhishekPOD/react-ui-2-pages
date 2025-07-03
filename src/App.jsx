import { useState } from "react";
import CalculatorTab from "./components/CalculatorTab";
import ShaderTab from "./components/ShaderTab";

export default function App() {
    const [tab, setTab] = useState("calc");
    return (
        <div style={{ position: "absolute", top: 0, left: 0, padding: "1rem" }}>
            <div>
                <button onClick={() => setTab("calc")}>Calculator</button>
                <button onClick={() => setTab("shader")}>Text-to-Shader</button>
            </div>
            {tab === "calc" ? <CalculatorTab /> : <ShaderTab />}
        </div>
    );
}
