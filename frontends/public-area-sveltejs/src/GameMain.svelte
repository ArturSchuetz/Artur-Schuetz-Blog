<script>
    import { onMount } from "svelte";

    let canvasWidth = 600; // Startbreite
    let canvasHeight = 400; // Starthöhe

    // Verwendung einer reaktiven Anweisung, um Änderungen zu überwachen und anzupassen
    $: aspectRatio = canvasWidth / canvasHeight;
    $: uiStyle = `width: ${canvasWidth}px; height: ${canvasHeight}px;`;

    // Vertex-Shader
    const vertShaderSource = `
	attribute vec2 position;
	void main() {
		gl_Position = vec4(position, 0, 1);
	}
	`;

    // Fragment-Shader mit einer uniform für die Farbe
    const fragShaderSource = `
	precision mediump float;
	uniform vec4 u_color;
	void main() {
		gl_FragColor = u_color;
	}
	`;

    // Funktion zum Erstellen eines Shaders
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(
                "ERROR compiling shader!",
                gl.getShaderInfoLog(shader),
            );
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Funktion zum Erstellen und Linken eines Shader-Programms
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(
                "ERROR linking program!",
                gl.getProgramInfoLog(program),
            );
            return null;
        }
        return program;
    }

    // Die Render-Funktion
    function render(gl, program, hue) {
        // Farbe basierend auf dem Hue-Wert berechnen
        const rgb = hslToRgb(hue / 360, 1, 0.5);

        // Uniform-Location holen und Farbe setzen
        const uColorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(uColorLocation, rgb[0], rgb[1], rgb[2], 1.0);

        // Clear
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Dreieck zeichnen
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Farbe für den nächsten Frame aktualisieren
        requestAnimationFrame(() => render(gl, program, (hue + 1) % 360));
    }

    // HSL zu RGB Konversion
    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatisch
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r, g, b];
    }

    window.addEventListener("load", () => {
        const canvas = document.getElementById("webgl-canvas");
        const gl = canvas.getContext("webgl");
        if (!gl) {
            alert("WebGL wird von deinem Browser nicht unterstützt.");
            return;
        }

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
        const fragShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragShaderSource,
        );
        const program = createProgram(gl, vertShader, fragShader);
        gl.useProgram(program);

        // Positionen der Eckpunkte des Dreiecks
        const positions = new Float32Array([
            0.0,
            0.5, // Spitze
            -0.5,
            -0.5, // Unten links
            0.5,
            -0.5, // Unten rechts
        ]);

        // Position Buffer erstellen
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        // Position-Attribute im Shader setzen
        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Mit dem Rendering beginnen
        render(gl, program, 0);
    });

    onMount(() => {
        // Beispiel: Anpassen der Canvas-Größe basierend auf Fenstergröße oder anderen Faktoren
        function resizeCanvas() {
            const aspectRatio = canvasWidth / canvasHeight;
            canvasWidth = window.innerWidth; // Oder ein anderes Kriterium für die Breite
            canvasHeight = canvasWidth / aspectRatio; // Anpassen der Höhe basierend auf dem Seitenverhältnis

            // Optional: Überprüfung, ob die Höhe nicht größer als window.innerHeight ist,
            // und ggf. weitere Anpassungen vornehmen
        }

        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    });
</script>

<div
    class="game-container"
    style="width: {canvasWidth}px; height: {canvasHeight}px;"
>
    <canvas
        id="webgl-canvas"
        width="600"
        height="400"
        bind:clientWidth={canvasWidth}
        bind:clientHeight={canvasHeight}
    ></canvas>
    <div
        class="game-ui"
        style="width: {canvasWidth}px; height: {canvasHeight}px;"
    >
        <button> Farbe ändern </button>
    </div>
</div>

<style>
    #webgl-canvas {
        width: 100%; /* Mache das Canvas responsive */
        max-width: 1920px; /* Maximale Breite */
        height: auto; /* Höhe automatisch anpassen */
        display: block; /* Verhindert, dass Ränder um das Canvas entstehen */
        margin: 0 auto; /* Zentriere das Canvas horizontal */
    }

    .game-container {
        position: relative;
    }

    .game-ui {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        /* Weitere UI-Styling-Optionen hier */
    }

    .game-ui button {
        position: absolute;
        bottom: 10px; /* Abstand vom unteren Rand */
        left: 10px; /* Abstand vom linken Rand */
        pointer-events: auto; /* Stellt sicher, dass der Button klickbar ist */
    }
</style>
