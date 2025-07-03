import { useState } from "react";
import { evaluate } from "calc_wasm";

export default function CalculatorTab() {
    const [expr, setExpr] = useState("");
    const [result, setResult] = useState(null);
    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h3>Web Assembly Calculator</h3>
            <input
                style={{
                    width: "300px",
                    height: "40px",
                    fontSize: "16px",
                    padding: "8px",
                }}
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
            />
            <button
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                    try {
                        const res = evaluate(expr);
                        setResult(res.toString());
                    } catch (err) {
                        setResult(err || "Invalid expression");
                    }
                }}
            >
                Calculate
            </button>
            <h3>Output:</h3>
            <div>
                <h3>Result: {String(result)}</h3>
            </div>
        </div>
    );
}
