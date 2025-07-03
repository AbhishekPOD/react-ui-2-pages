import { useRef, useState, useEffect } from "react";

export default function ShaderTab() {
    const [prompt, setPrompt] = useState("");
    const [shaderCode, setShaderCode] = useState("");
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    async function generateShader() {
        const res = await fetch(
            "https://elixir-backend-wwu6.onrender.com/api/shader",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            }
        ).catch((err) => setShaderCode("Error: " + data.error));
        const data = await res.json();

        if (data.success) {
            setShaderCode(data.shader);
            compileAndRender(data.shader);
        } else {
            setShaderCode("Error: " + data.error);
        }
    }

    function compileAndRender(fragmentShaderCode) {
        cancelAnimationFrame(animationRef.current);

        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");
        if (!gl) return alert("WebGL not supported");

        const vertexShaderCode = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

        function createShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        try {
            const vertexShader = createShader(
                gl.VERTEX_SHADER,
                vertexShaderCode
            );
            const fragmentShader = createShader(
                gl.FRAGMENT_SHADER,
                fragmentShaderCode
            );

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(program));
            }

            gl.useProgram(program);

            const vertices = new Float32Array([
                -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const posLoc = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            const resolutionLoc = gl.getUniformLocation(program, "resolution");
            const timeLoc = gl.getUniformLocation(program, "time");
            gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            function animate() {
                gl.useProgram(program);
                gl.uniform1f(timeLoc, performance.now() / 1000);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                animationRef.current = requestAnimationFrame(animate);
            }

            animate();
        } catch (e) {
            setShaderCode((prev) => prev + `\n\n[Shader Error]: ${e.message}`);
        }
    }

    useEffect(() => {
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h3>WebGL Shader Generator</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the shader you want..."
                style={{
                    width: "100%",
                    height: "3rem",
                    fontSize: "16px",
                    padding: "8px",
                }}
            />
            <button onClick={generateShader}>Generate Shader</button>
            <h3>Shader Output:</h3>
            <canvas
                ref={canvasRef}
                width={512}
                height={512}
                style={{ border: "1px solid #ccc" }}
            />
            <h3>Raw GLSL Code:</h3>
            <pre
                style={{
                    background: "#111",
                    color: "#0f0",
                    padding: "1rem",
                    overflowX: "auto",
                }}
            >
                {shaderCode}
            </pre>
        </div>
    );
}
