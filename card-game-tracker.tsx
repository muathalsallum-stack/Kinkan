import { useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];

function FloatingCard({ suit, style }) {
  return (
    <div style={{
      position: "absolute",
      fontSize: "clamp(20px, 3vw, 36px)",
      opacity: 0.06,
      color: suit === "♥" || suit === "♦" ? "#e74c3c" : "#1a1a2e",
      fontWeight: "bold",
      userSelect: "none",
      animation: `floatCard ${6 + Math.random() * 4}s ease-in-out infinite`,
      ...style,
    }}>
      {suit}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("setup"); // setup | game
  const [players, setPlayers] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [rounds, setRounds] = useState([]);

  // Round entry state
  const [winType, setWinType] = useState(""); // "hand" | "khalas"
  const [winner, setWinner] = useState("");
  const [hasFal, setHasFal] = useState(null); // null | true | false
  const [falPlayer, setFalPlayer] = useState("");
  const [falScore, setFalScore] = useState("");
  const [step, setStep] = useState(1); // 1=wintype, 2=winner, 3=fal question, 4=fal player, 5=confirm

  const addPlayer = () => {
    const name = nameInput.trim();
    if (!name || players.includes(name) || players.length >= 10) return;
    setPlayers([...players, name]);
    setNameInput("");
  };

  const startGame = () => {
    if (players.length < 2) return;
    setPhase("game");
  };

  const getTotals = () => {
    const totals = {};
    players.forEach(p => totals[p] = 0);
    rounds.forEach(r => {
      Object.entries(r.scores).forEach(([p, s]) => {
        totals[p] = (totals[p] || 0) + s;
      });
    });
    return totals;
  };

  const submitRound = () => {
    const scores = {};
    players.forEach(p => {
      if (p === winner) {
        scores[p] = winType === "hand" ? -60 : -30;
      } else if (hasFal && p === falPlayer) {
        scores[p] = parseInt(falScore) || 0;
      } else {
        scores[p] = winType === "hand" ? 400 : 200;
      }
    });
    setRounds([...rounds, { winType, winner, hasFal, falPlayer, falScore, scores }]);
    // reset
    setWinType(""); setWinner(""); setHasFal(null);
    setFalPlayer(""); setFalScore(""); setStep(1);
  };

  const totals = getTotals();
  const sorted = [...players].sort((a, b) => (totals[a] || 0) - (totals[b] || 0));

  const canProceed = () => {
    if (step === 1) return winType !== "";
    if (step === 2) return winner !== "";
    if (step === 3) return hasFal !== null;
    if (step === 4) return falPlayer !== "" && falScore !== "";
    return true;
  };

  const nextStep = () => {
    if (step === 3 && hasFal === false) { setStep(5); return; }
    setStep(step + 1);
  };

  const bgCards = [
    { suit: "♠", style: { top: "5%", left: "3%" } },
    { suit: "♥", style: { top: "15%", right: "5%" } },
    { suit: "♦", style: { bottom: "20%", left: "8%" } },
    { suit: "♣", style: { bottom: "10%", right: "10%" } },
    { suit: "♠", style: { top: "50%", left: "50%" } },
    { suit: "♥", style: { top: "35%", right: "20%" } },
  ];

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(255,215,0,0); }
        }
        .btn-gold {
          background: linear-gradient(135deg, #f6d365, #fda085);
          color: #1a1a2e;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(246,211,101,0.4); }
        .btn-gold:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .btn-outline {
          background: transparent;
          color: #f6d365;
          border: 2px solid #f6d365;
          border-radius: 12px;
          padding: 10px 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: rgba(246,211,101,0.1); }
        .btn-select {
          background: rgba(255,255,255,0.05);
          color: #ccc;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 10px 20px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }
        .btn-select.active {
          background: linear-gradient(135deg, #f6d365, #fda085);
          color: #1a1a2e;
          border-color: transparent;
        }
        .btn-select:hover { border-color: #f6d365; }
        .card-box {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          animation: slideIn 0.4s ease;
        }
        input {
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus { border-color: #f6d365; }
        input::placeholder { color: rgba(255,255,255,0.35); }
        .player-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(246,211,101,0.12);
          border: 1px solid rgba(246,211,101,0.3);
          color: #f6d365;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 600;
        }
        .remove-btn {
          background: none;
          border: none;
          color: #fda085;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          line-height: 1;
        }
        .score-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .score-row.leader {
          background: rgba(246,211,101,0.1);
          border-color: rgba(246,211,101,0.3);
          animation: pulse 2s infinite;
        }
      `}</style>

      {bgCards.map((c, i) => <FloatingCard key={i} suit={c.suit} style={c.style} />)}

      <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "4px" }}>🃏</div>
          <h1 style={{ color: "#f6d365", margin: 0, fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 800, letterSpacing: "1px" }}>
            حاسبة كنكان
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontSize: "14px" }}>
            {phase === "setup" ? "أضف اللاعبين للبدء" : `جولة ${rounds.length + 1} • ${players.length} لاعبين`}
          </p>
        </div>

        {/* SETUP PHASE */}
        {phase === "setup" && (
          <div className="card-box">
            <h2 style={{ color: "white", margin: "0 0 20px", fontSize: "18px" }}>
              👥 اللاعبون ({players.length}/10)
            </h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <input
                placeholder="اسم اللاعب..."
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPlayer()}
                maxLength={20}
              />
              <button className="btn-gold" onClick={addPlayer} disabled={!nameInput.trim() || players.length >= 10} style={{ whiteSpace: "nowrap", padding: "12px 20px" }}>
                إضافة
              </button>
            </div>
            {players.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {players.map(p => (
                  <span key={p} className="player-chip">
                    {p}
                    <button className="remove-btn" onClick={() => setPlayers(players.filter(x => x !== p))}>×</button>
                  </span>
                ))}
              </div>
            )}
            <button className="btn-gold" onClick={startGame} disabled={players.length < 2} style={{ width: "100%", padding: "14px", fontSize: "17px" }}>
              🎮 ابدأ اللعبة
            </button>
            {players.length < 2 && <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "13px", marginTop: "10px" }}>يجب إضافة لاعبَين على الأقل</p>}
          </div>
        )}

        {/* GAME PHASE */}
        {phase === "game" && (
          <>
            {/* Scoreboard */}
            <div className="card-box" style={{ marginBottom: "16px" }}>
              <h2 style={{ color: "white", margin: "0 0 16px", fontSize: "17px" }}>🏆 لوحة النتائج</h2>
              {sorted.map((p, i) => {
                const medals = [
                  {
                    bg: "linear-gradient(135deg, #FFD700, #FFA500)",
                    shadow: "0 4px 15px rgba(255,215,0,0.5)",
                    border: "2px solid #FFD700",
                    text: "#7a4a00",
                    label: "١",
                    icon: "♛",
                    glow: "rgba(255,215,0,0.3)",
                  },
                  {
                    bg: "linear-gradient(135deg, #C0C0C0, #888)",
                    shadow: "0 4px 12px rgba(192,192,192,0.4)",
                    border: "2px solid #C0C0C0",
                    text: "#333",
                    label: "٢",
                    icon: "✦",
                    glow: "rgba(192,192,192,0.2)",
                  },
                  {
                    bg: "linear-gradient(135deg, #CD7F32, #a0522d)",
                    shadow: "0 4px 12px rgba(205,127,50,0.4)",
                    border: "2px solid #CD7F32",
                    text: "#3d1a00",
                    label: "٣",
                    icon: "✦",
                    glow: "rgba(205,127,50,0.2)",
                  },
                ];
                const medal = medals[i];
                return (
                  <div key={p} className={`score-row${i === 0 ? " leader" : ""}`} style={i === 0 ? { background: "rgba(255,215,0,0.07)", borderColor: "rgba(255,215,0,0.25)" } : {}}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {medal ? (
                        <div style={{
                          width: "38px", height: "38px",
                          borderRadius: "50%",
                          background: medal.bg,
                          boxShadow: medal.shadow,
                          border: medal.border,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          position: "relative",
                        }}>
                          <span style={{ fontSize: "17px", color: medal.text, fontWeight: 900, lineHeight: 1 }}>{medal.icon}</span>
                          <span style={{
                            position: "absolute", bottom: "-6px", right: "-4px",
                            background: medal.bg,
                            border: medal.border,
                            borderRadius: "8px",
                            fontSize: "9px",
                            fontWeight: 900,
                            color: medal.text,
                            padding: "1px 4px",
                            lineHeight: 1.2,
                          }}>{medal.label}</span>
                        </div>
                      ) : (
                        <div style={{
                          width: "38px", height: "38px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          color: "rgba(255,255,255,0.4)",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}>{i + 1}</div>
                      )}
                      <span style={{ color: "white", fontWeight: 600, fontSize: "15px" }}>{p}</span>
                    </div>
                    <span style={{
                      fontWeight: 800,
                      fontSize: "18px",
                      color: totals[p] <= 0 ? "#6ee7b7" : totals[p] > 500 ? "#fca5a5" : "#f6d365"
                    }}>
                      {totals[p]}
                    </span>
                  </div>
                );
              })}
              {rounds.length > 0 && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center", marginTop: "12px", marginBottom: 0 }}>
                  {rounds.length} جولة مكتملة
                </p>
              )}
            </div>

            {/* Round Entry */}
            <div className="card-box">
              <h2 style={{ color: "white", margin: "0 0 20px", fontSize: "17px" }}>➕ تسجيل جولة جديدة</h2>

              {/* Step 1: Win Type */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "10px", fontSize: "14px" }}>نوع الفوز:</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className={`btn-select${winType === "hand" ? " active" : ""}`} onClick={() => setWinType("hand")}>
                    🖐 هاند
                  </button>
                  <button className={`btn-select${winType === "khalas" ? " active" : ""}`} onClick={() => setWinType("khalas")}>
                    ✅ خالص
                  </button>
                </div>
              </div>

              {/* Step 2: Winner */}
              {winType && (
                <div style={{ marginBottom: "20px", animation: "slideIn 0.3s ease" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "10px", fontSize: "14px" }}>
                    اللاعب الفائز ({winType === "hand" ? "-60" : "-30"} نقطة):
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {players.map(p => (
                      <button key={p} className={`btn-select${winner === p ? " active" : ""}`} onClick={() => setWinner(p)} style={{ flex: "none" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Fal Question */}
              {winType && winner && (
                <div style={{ marginBottom: "20px", animation: "slideIn 0.3s ease" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "10px", fontSize: "14px" }}>
                    🔮 هل يوجد أحد فال؟
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className={`btn-select${hasFal === true ? " active" : ""}`} onClick={() => setHasFal(true)}>نعم</button>
                    <button className={`btn-select${hasFal === false ? " active" : ""}`} onClick={() => { setHasFal(false); setFalPlayer(""); setFalScore(""); }}>لا</button>
                  </div>
                </div>
              )}

              {/* Step 4: Fal Player & Score */}
              {winType && winner && hasFal === true && (
                <div style={{ marginBottom: "20px", animation: "slideIn 0.3s ease" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "10px", fontSize: "14px" }}>اختر اللاعب الفال:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                    {players.filter(p => p !== winner).map(p => (
                      <button key={p} className={`btn-select${falPlayer === p ? " active" : ""}`} onClick={() => setFalPlayer(p)} style={{ flex: "none" }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  {falPlayer && (
                    <div style={{ animation: "slideIn 0.3s ease" }}>
                      <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "8px", fontSize: "14px" }}>نتيجة الفال يدويًا:</p>
                      <input
                        type="number"
                        placeholder="أدخل النتيجة..."
                        value={falScore}
                        onChange={e => setFalScore(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Preview */}
              {winType && winner && hasFal !== null && (hasFal === false || (falPlayer && falScore !== "")) && (
                <div style={{ background: "rgba(246,211,101,0.08)", border: "1px solid rgba(246,211,101,0.2)", borderRadius: "14px", padding: "16px", marginBottom: "20px", animation: "slideIn 0.3s ease" }}>
                  <p style={{ color: "#f6d365", fontWeight: 700, marginBottom: "10px", fontSize: "15px" }}>📋 ملخص الجولة:</p>
                  {players.map(p => {
                    let s;
                    if (p === winner) s = winType === "hand" ? -60 : -30;
                    else if (hasFal && p === falPlayer) s = parseInt(falScore) || 0;
                    else s = winType === "hand" ? 400 : 200;
                    return (
                      <div key={p} style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.8)", fontSize: "14px", marginBottom: "4px" }}>
                        <span>{p} {p === winner ? "🏆" : hasFal && p === falPlayer ? "🔮" : ""}</span>
                        <span style={{ fontWeight: 700, color: s < 0 ? "#6ee7b7" : "#fca5a5" }}>{s > 0 ? "+" : ""}{s}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="btn-gold"
                style={{ width: "100%", padding: "14px", fontSize: "16px" }}
                disabled={!winType || !winner || hasFal === null || (hasFal === true && (!falPlayer || falScore === ""))}
                onClick={submitRound}
              >
                ✅ تأكيد الجولة
              </button>
            </div>

            {/* Round History */}
            {rounds.length > 0 && (
              <div className="card-box" style={{ marginTop: "16px" }}>
                <h2 style={{ color: "white", margin: "0 0 16px", fontSize: "17px" }}>📜 سجل الجولات</h2>
                {rounds.map((r, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: "#f6d365", fontWeight: 700, fontSize: "14px" }}>جولة {i + 1}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                        {r.winType === "hand" ? "🖐 هاند" : "✅ خالص"} • فاز: {r.winner}
                        {r.hasFal ? ` • فال: ${r.falPlayer}` : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {Object.entries(r.scores).map(([p, s]) => (
                        <span key={p} style={{ fontSize: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3px 10px", color: s < 0 ? "#6ee7b7" : "rgba(255,255,255,0.6)" }}>
                          {p}: {s > 0 ? "+" : ""}{s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "28px", paddingBottom: "8px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "30px", padding: "8px 20px" }}>
            <span style={{ color: "#f6d365", fontSize: "14px" }}>♠</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", letterSpacing: "0.3px" }}>
              برمجة وتطوير
            </span>
            <span style={{ color: "#f6d365", fontWeight: 700, fontSize: "13px" }}>معاذ السلوم</span>
            <span style={{ color: "#f6d365", fontSize: "14px" }}>♠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
