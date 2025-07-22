import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

// Helper: random array element
const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

// Helper: random position (in percentage)
const randomPos = () => ({
  top: `${Math.random() * 80 + 5}%`,
  left: `${Math.random() * 80 + 5}%`,
  rotate: `${Math.random() * 40 - 20}deg`
});

// LocalStorage keys
const LS_NAMES = "winner_names";
const LS_BG = "winner_bg";
const LS_DURATION = "winner_duration";

export default function RandomNamePickerApp() {
  // State
  const [names, setNames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_NAMES)) || [];
    } catch { return []; }
  });
  const [bgImage, setBgImage] = useState(() => localStorage.getItem(LS_BG) || "");
  const [duration, setDuration] = useState(() => Number(localStorage.getItem(LS_DURATION)) || 20);

  const [manualNames, setManualNames] = useState(""); // textarea
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(duration);
  const [poppedName, setPoppedName] = useState(null); // {name, pos}
  const [winner, setWinner] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef();
  const popRef = useRef();

  // Fullscreen enter/exit helpers
  const displayAreaRef = useRef();
  const enterFullscreen = () => {
    const el = displayAreaRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  // Save to localStorage
  useEffect(() => { localStorage.setItem(LS_NAMES, JSON.stringify(names)); }, [names]);
  useEffect(() => { localStorage.setItem(LS_BG, bgImage); }, [bgImage]);
  useEffect(() => { localStorage.setItem(LS_DURATION, duration); }, [duration]);

  // Animation loop
  useEffect(() => {
    if (running && names.length > 0) {
      // Enter fullscreen at start
      enterFullscreen();
      setWinner(null);
      setCountdown(duration);

      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setRunning(false);
            clearInterval(timerRef.current);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);

      // Popping animation
      popRef.current = setInterval(() => {
        const name = randomFromArray(names);
        setPoppedName({ name, pos: randomPos() });
      }, 70); // ~14 names/sec

      return () => {
        clearInterval(timerRef.current);
        clearInterval(popRef.current);
      };
    } else if (!running && names.length > 0 && countdown === 0) {
      // Pick winner after time up
      setTimeout(() => {
        const winnerName = randomFromArray(names);
        setWinner(winnerName);
        setPoppedName(null);
        exitFullscreen();
      }, 400); // short pause before winner
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(popRef.current);
    };
    // eslint-disable-next-line
  }, [running, names, duration, countdown]);

  // Excel upload handler
  const handleExcel = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // Get first column, skip empty
      const extracted = rows.map(r => r[0]).filter(x => !!x && typeof x === "string" && x.trim().length > 0);
      setNames(extracted);
      setManualNames(extracted.join("\n"));
    };
    reader.readAsBinaryString(file);
  };

  // Manual entry update
  const handleManualNames = e => {
    setManualNames(e.target.value);
    const list = e.target.value.split("\n").map(x => x.trim()).filter(x => x);
    setNames(list);
  };

  // Background upload
  const handleBg = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => setBgImage(evt.target.result);
    reader.readAsDataURL(file);
  };

  // Start/Stop/Reset
  const start = () => {
    if (names.length < 2) return alert("Please provide at least two names.");
    setCountdown(duration);
    setWinner(null);
    setRunning(true);
  };
  const stop = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setCountdown(duration);
    setWinner(null);
    setPoppedName(null);
    // (keep names and bg)
  };

  // Winner dismiss
  const dismissWinner = () => setWinner(null);

  // Responsive styles (CSS-in-JS here for one-file, put in .css for prod)
  const styles = {
    app: {
      fontFamily: "system-ui, sans-serif",
      minHeight: "100vh",
      background: bgImage ? `url("${bgImage}") center/cover no-repeat` : "#101c2c",
      transition: "background .3s",
      position: "relative"
    },
    controls: {
      background: "rgba(255,255,255,0.9)",
      borderRadius: 12,
      padding: 24,
      maxWidth: 500,
      margin: "32px auto",
      boxShadow: "0 6px 24px #0004"
    },
    button: {
      margin: "0 8px 8px 0",
      padding: "10px 20px",
      borderRadius: 6,
      border: "none",
      fontWeight: "bold",
      fontSize: 16,
      background: "#1e88e5",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 2px 6px #0001"
    },
    display: {
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 30,
      background: bgImage ? `url("${bgImage}") center/cover no-repeat` : "#101c2c"
    },
    popped: poppedName ? {
      position: "absolute",
      color: "#fff",
      background: "#0008",
      borderRadius: "1em",
      fontSize: "clamp(2rem, 8vw, 5rem)",
      fontWeight: "bold",
      padding: "0.5em 1em",
      boxShadow: "0 2px 18px #0006",
      top: poppedName.pos.top, left: poppedName.pos.left,
      transform: `rotate(${poppedName.pos.rotate})`,
      opacity: 1,
      animation: "fadePop 0.25s linear"
    } : {},
    winner: winner ? {
      position: "fixed",
      top: "50%", left: "50%", transform: "translate(-50%,-50%)",
      color: "#fff",
      background: "linear-gradient(90deg,#faad14,#f5222d,#1890ff 70%)",
      fontSize: "clamp(2.5rem, 10vw, 7rem)",
      border: "6px solid #fff",
      borderRadius: 30,
      padding: "0.4em 1.2em",
      fontWeight: "bold",
      zIndex: 90,
      boxShadow: "0 4px 48px #000d",
      textShadow: "0 2px 24px #000c",
      animation: "flash 1s infinite alternate"
    } : {},
    timer: {
      position: "fixed", top: 18, right: 32,
      fontSize: 32, color: "#fff",
      background: "#000a", borderRadius: 12, padding: "6px 20px",
      fontWeight: "bold", letterSpacing: 2,
      zIndex: 99
    },
    settings: {
      background: "#fff", borderRadius: 12,
      position: "absolute", right: 30, top: 18,
      padding: "18px 24px", boxShadow: "0 4px 32px #0002"
    }
  };

  // Keyframes (inject at runtime for all-in-one)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadePop {
        0% { opacity: 0; transform: scale(0.8) rotate(var(--deg, 0deg)); }
        60% { opacity: 1; transform: scale(1.12) rotate(var(--deg, 0deg)); }
        100% { opacity: 1; transform: scale(1) rotate(var(--deg, 0deg)); }
      }
      @keyframes flash {
        from { box-shadow: 0 0 60px 10px #fff3,0 0 8px 2px #faad14; }
        to   { box-shadow: 0 0 60px 30px #fff,0 0 18px 6px #faad14; }
      }
      @media (max-width: 600px) {
        .controls { padding: 12px !important; }
        .winner { font-size: 2.5rem !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // UI
  return (
    <div style={styles.app} ref={displayAreaRef}>
      {/* Controls */}
      <div style={styles.controls} className="controls">
        <h2>Random Name Picker</h2>
        <div style={{ marginBottom: 16 }}>
          <label>
            <b>Import Excel: </b>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcel} />
          </label>
        </div>
        <div>
          <b>Or paste/edit names (one per line):</b>
          <textarea
            rows={5}
            style={{ width: "100%", marginTop: 8, fontSize: 16, borderRadius: 8, padding: 8 }}
            value={manualNames}
            onChange={handleManualNames}
            placeholder="Enter names, one per line..."
          />
        </div>
        <div style={{ marginTop: 14 }}>
          <b>Background image: </b>
          <input type="file" accept="image/*" onChange={handleBg} />
          {bgImage && (
            <button style={{ ...styles.button, background: "#d32f2f" }} onClick={() => setBgImage("")}>Remove</button>
          )}
        </div>
        <div style={{ marginTop: 20 }}>
          <button style={styles.button} onClick={start} disabled={running || names.length < 2}>Start</button>
          <button style={{ ...styles.button, background: "#888" }} onClick={stop} disabled={!running}>Stop</button>
          <button style={{ ...styles.button, background: "#388e3c" }} onClick={reset}>Reset</button>
          <button style={{ ...styles.button, background: "#fff", color: "#333", border: "1px solid #999" }} onClick={() => setShowSettings(s => !s)}>Settings</button>
        </div>
        <div style={{ marginTop: 10, fontSize: 14, color: "#444" }}>
          <b>Names loaded:</b> {names.length}
        </div>
      </div>

      {showSettings && (
        <div style={styles.settings}>
          <b>Randomizing Duration (seconds): </b>
          <input
            type="number"
            min="5" max="90"
            value={duration}
            onChange={e => setDuration(Math.max(5, Math.min(90, Number(e.target.value))))}
            style={{ width: 60, fontSize: 18, marginLeft: 8 }}
          />
          <button style={{ ...styles.button, background: "#fff", color: "#222", marginLeft: 14 }} onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}

      {/* Fullscreen Display during running & winner */}
      {(running || winner || poppedName) && (
        <div style={styles.display}>
          {/* Timer */}
          {running && <div style={styles.timer}>{countdown}s</div>}
          {/* Random popping name */}
          {running && poppedName && (
            <div style={styles.popped}>{poppedName.name}</div>
          )}
          {/* Winner */}
          {winner && (
            <div style={styles.winner} className="winner" tabIndex={0} onClick={dismissWinner}>
              🎉 Winner: {winner} 🎉
              <div style={{ fontSize: 18, marginTop: 12, color: "#fff" }}>
                <i>(Click to dismiss)</i>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
