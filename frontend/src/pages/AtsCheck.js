// src/pages/AtsCheck.jsx
import { useState } from "react";
import { extractPdfText } from "../utils/pdfExtractor";

// Put your real key in env for production
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

/**
 * ATS checker component
 * - whitelist-based keyword matching (only technical keywords)
 * - summary removed from dashboard
 * - professional report shown last
 */
export default function AtsCheck() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Parsed outputs
  const [reportText, setReportText] = useState(""); // text report (professional)
  const [atsResult, setAtsResult] = useState(null); // dashboard metrics

  // ====== TECH KEYWORD WHITELIST & STOPWORDS ======
  const STOPWORDS = new Set([
    "the", "and", "or", "a", "an", "with", "for", "to", "in", "on", "of", "is", "are",
    "as", "by", "from", "at", "this", "that", "these", "those", "be", "will", "have",
    "has", "had", "its", "your", "you", "we", "they", "their", "our", "it", "about",
    "into", "over", "under", "per", "via", "using", "use", "used", "work", "working",
    "responsibilities", "requirements", "skills", "role", "roles", "experience"
  ]);

  const TECH_KEYWORDS = [
    "html","css","javascript","typescript","react","nextjs","vue","angular",
    "node","express","mongodb","mysql","postgresql","firebase","aws","azure",
    "gcp","docker","kubernetes","git","github","gitlab","java","python",
    "c","c++","c#","django","flask","rest api","graphql",
    "machine learning","ml","ai","nlp","tensorflow","pytorch","devops",
    "jenkins","linux","tailwind","bootstrap","sass","scss","sql","nosql",
    "redis","rabbitmq","kafka","terraform","ansible","ci/cd","docker-compose",
    "redux","mobx","rxjs","websocket","webpack","babel","storybook",
    "unit test","jest","mocha","enzyme","selenium","puppeteer"
  ];

  // ====== MAIN ANALYZE FUNCTION ======
  async function analyzeATS() {
    try {
      setErrorMsg("");
      setReportText("");
      setAtsResult(null);

      if (!file) return alert("Please upload a resume PDF.");
      if (!jobDescription.trim()) return alert("Paste the job description.");

      setLoading(true);

      // 1) Extract text
      const resumeText = await extractPdfText(file);

      // 2) Build prompt
      const prompt = `
You are an ATS evaluator.

Return TWO blocks in EXACT order:

<JSON>
A strict JSON object with only these keys:
{
  "score": "85%",
  "matched_keywords": ["JavaScript","React"],
  "missing_keywords": ["Docker","AWS"],
  "skills_score": 70,
  "jd_score": 60,
  "ats_format": 80
}
</JSON>

<REPORT>
A corporate HR-style ATS report with sections:
- Overview
- Relevance to Job Description
- Keyword Coverage
- Strengths
- Gaps & Risks
- Recommendations (actionable)
- Closing Summary
No emojis. Use concise professional tone.
</REPORT>

IMPORTANT:
- JSON must be valid JSON (no trailing commas).
- REPORT must be plain text paragraphs with short headers.

--- RESUME TEXT ---
${resumeText}

--- JOB DESCRIPTION ---
${jobDescription}
`;

      // 3) Call Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 4) Parse output
      const jsonMatch = raw.match(/<JSON>\s*([\s\S]*?)\s*<\/JSON>/i);
      const reportMatch = raw.match(/<REPORT>\s*([\s\S]*?)\s*<\/REPORT>/i);

      let parsedJSON = null;
      if (jsonMatch) {
        try {
          parsedJSON = JSON.parse(jsonMatch[1]);
        } catch {
          parsedJSON = null;
        }
      }
      const report = reportMatch ? reportMatch[1].trim() : "";

      // 5) Fallback
      if (!parsedJSON) {
        parsedJSON = whitelistHeuristicMatch(resumeText, jobDescription);
      }

      // 6) Normalize
      const normalized = normalizeAtsJson(parsedJSON);

      // 7) Save
      setAtsResult(normalized);
      setReportText(report || defaultReport(normalized));
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ====== HELPER FUNCTIONS ======
  function normalizeTextForSearch(t) {
    return String(t || "")
      .toLowerCase()
      .replace(/[^\w\s+#\-./]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function keywordPresentInText(keyword, textNormalized) {
    const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${esc}\\b`, "i");
    return re.test(textNormalized);
  }

  function whitelistHeuristicMatch(resumeText, jdText) {
    const rNorm = normalizeTextForSearch(resumeText);
    const jdNorm = normalizeTextForSearch(jdText);

    const jdKeywords = TECH_KEYWORDS.filter((kw) => {
      const lc = kw.toLowerCase();
      if (STOPWORDS.has(lc) || lc.length < 2) return false;
      return keywordPresentInText(lc, jdNorm);
    });

    const uniqueJDKeys = Array.from(new Set(jdKeywords));
    const matched = [];
    const missing = [];

    uniqueJDKeys.forEach((k) => {
      if (keywordPresentInText(k.toLowerCase(), rNorm)) matched.push(k);
      else missing.push(k);
    });

    const matchPct = Math.round((matched.length / Math.max(uniqueJDKeys.length, 1)) * 100);
    const skillsScore = matchPct;
    const jdScore = Math.round(matchPct * 0.85);
    const fmtScore = 80;
    const overall = Math.round((skillsScore + jdScore + fmtScore) / 3);

    return {
      score: `${overall}%`,
      matched_keywords: matched,
      missing_keywords: missing,
      skills_score: skillsScore,
      jd_score: jdScore,
      ats_format: fmtScore,
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, Number(n) || 0));
  }

  function normalizeAtsJson(obj) {
    const pct = (v, def = 0) => {
      if (typeof v === "string" && v.trim().endsWith("%")) {
        const n = Number(v.replace("%", ""));
        return isFinite(n) ? clamp(n, 0, 100) : def;
      }
      if (typeof v === "number") return clamp(v, 0, 100);
      return def;
    };

    const scoreN = pct(obj?.score, 0);
    return {
      score: `${scoreN}%`,
      matched_keywords: Array.isArray(obj?.matched_keywords)
        ? obj.matched_keywords
        : [],
      missing_keywords: Array.isArray(obj?.missing_keywords)
        ? obj.missing_keywords
        : [],
      summary: obj?.summary || "",
      skills_score: pct(obj?.skills_score, 0),
      jd_score: pct(obj?.jd_score, 0),
      ats_format: pct(obj?.ats_format, 0),
    };
  }

  function defaultReport(r) {
    return [
      "Overview",
      `Estimated ATS match: ${r.score}. This estimate is based on whitelist keyword overlap and a simple format check.`,
      "",
      "Relevance to Job Description",
      "The resume demonstrates partial alignment. Strengthen core role-specific technical keywords and domain experience.",
      "",
      "Keyword Coverage",
      `Matched: ${r.matched_keywords.slice(0, 12).join(", ") || "—"}.`,
      `Missing: ${r.missing_keywords.slice(0, 12).join(", ") || "—"}.`,
      "",
      "Strengths",
      "- Some relevant technical keywords are present.",
      "",
      "Gaps & Risks",
      "- Missing or under-used role-specific keywords lowers ATS match.",
      "- Consider adding concrete project bullet points showing impact.",
      "",
      "Recommendations",
      "- Add missing keywords naturally in skills/experience.",
      "- Use consistent tech names (e.g. 'React' not 'reactjs' mixed casing).",
      "- Emphasize measurable outcomes (numbers, percentages).",
      "",
      "Closing Summary",
      "With targeted keyword and experience tweaks, the resume's ATS match should improve.",
    ].join("\n");
  }

  // ====== UI ======
  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
    else alert("Please upload a valid PDF file.");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
    else alert("Please upload a valid PDF file.");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>ATS Score Checker</h1>
      <p style={styles.sub}>
        Upload your resume PDF and paste the job description to analyze fit.
      </p>

      {/* Upload box */}
      <div
        style={{
          ...styles.uploadBox,
          borderColor: dragging ? "#38bdf8" : "#334155",
          background: dragging
            ? "rgba(59,130,246,0.08)"
            : "rgba(255,255,255,0.03)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {!file ? (
          <>
            <div style={{ fontSize: 56, lineHeight: 1 }}>📄</div>
            <p style={{ marginTop: 10 }}>Drag & drop your resume (PDF)</p>
            <p style={{ marginTop: -5, fontSize: 14, color: "#9ca3af" }}>or</p>
            <label style={styles.uploadBtn}>
              Choose PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileSelect}
              />
            </label>
          </>
        ) : (
          <div>
            <strong>Uploaded:</strong> {file.name}
            <button style={styles.removeBtn} onClick={() => setFile(null)}>
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Job description */}
      <textarea
        style={styles.jdBox}
        placeholder="Paste Job Description here…"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {/* Analyze */}
      <button
        onClick={analyzeATS}
        style={{
          ...styles.analyzeBtn,
          opacity: file && jobDescription.trim() ? 1 : 0.5,
          pointerEvents: file && jobDescription.trim() ? "auto" : "none",
        }}
      >
        {loading ? "Analyzing…" : "Analyze ATS Score →"}
      </button>

      {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

      {(atsResult || reportText) && (
        <div style={ui.pageGrid}>
          {atsResult && (
            <section style={ui.dashboardCard}>
              <div style={ui.topRow}>
                <ScoreCircle score={atsResult.score} />
                <div style={{ flex: 1 }}>
                  <Progress label="Skills Match" value={atsResult.skills_score} />
                  <Progress label="JD Relevance" value={atsResult.jd_score} />
                  <Progress label="ATS Formatting" value={atsResult.ats_format} />
                </div>
              </div>

              <div style={ui.sectionBlock}>
                <h3 style={ui.h3}>Keyword Coverage</h3>
                <div style={ui.keywordRow}>
                  <div style={ui.kwCol}>
                    <div style={ui.kwHead}>Matched</div>
                    <div style={ui.chipsWrap}>
                      {atsResult.matched_keywords?.length ? (
                        atsResult.matched_keywords.map((k, i) => (
                          <span key={`m-${i}`} style={ui.chipGreen}>
                            {k}
                          </span>
                        ))
                      ) : (
                        <span style={ui.dim}>—</span>
                      )}
                    </div>
                  </div>
                  <div style={ui.kwCol}>
                    <div style={ui.kwHead}>Missing</div>
                    <div style={ui.chipsWrap}>
                      {atsResult.missing_keywords?.length ? (
                        atsResult.missing_keywords.map((k, i) => (
                          <span key={`x-${i}`} style={ui.chipRed}>
                            {k}
                          </span>
                        ))
                      ) : (
                        <span style={ui.dim}>—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {reportText && (
            <section style={ui.reportCard}>
              <h2 style={ui.h2}>Professional ATS Report</h2>
              <ReportBlock text={reportText} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Small components ---------- */

function ReportBlock({ text }) {
  const lines = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div>
      {lines.map((p, i) => (
        <p key={i} style={ui.p}>
          {p}
        </p>
      ))}
    </div>
  );
}

function ScoreCircle({ score }) {
  const n = Number(String(score).replace("%", "")) || 0;
  const dashArray = 440;
  const pct = Math.max(0, Math.min(100, n));
  const dashOffset = dashArray - (dashArray * pct) / 100;

  return (
    <div style={ui.scoreWrap}>
      <svg width="160" height="160">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#22c55e"
          strokeWidth="10"
          fill="none"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div style={ui.scoreCenter}>
        <div style={ui.scoreNum}>{score}</div>
        <div style={ui.scoreLabel}>ATS Match</div>
      </div>
    </div>
  );
}

function Progress({ label, value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div style={ui.progressItem}>
      <div style={ui.progressLabel}>
        <span>{label}</span>
        <span style={ui.percent}>{v}%</span>
      </div>
      <div style={ui.progressBar}>
        <div style={{ ...ui.progressFill, width: `${v}%` }} />
      </div>
    </div>
  );
}

/* ================= Styles ================= */

const styles = {
  page: {
    minHeight: "100vh",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  sub: { marginTop: 8, color: "#9ca3af" },

  uploadBox: {
    marginTop: 24,
    width: "100%",
    maxWidth: 820,
    border: "2px dashed #334155",
    borderRadius: 14,
    padding: 36,
    textAlign: "center",
    transition: "0.25s",
  },
  uploadBtn: {
    marginTop: 10,
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-block",
  },
  removeBtn: {
    marginTop: 10,
    marginLeft: 10,
    padding: "6px 12px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  jdBox: {
    width: "100%",
    maxWidth: 820,
    height: 160,
    marginTop: 24,
    background: "#0f172a",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #334155",
    fontSize: 15,
  },
  analyzeBtn: {
    marginTop: 22,
    padding: "12px 26px",
    background: "#22c55e",
    color: "#000",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
  errorBox: {
    marginTop: 16,
    maxWidth: 820,
    width: "100%",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#fecaca",
    padding: 12,
    borderRadius: 10,
  },
};

const ui = {
  pageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
    marginTop: 28,
    width: "100%",
    maxWidth: 1100,
  },
  reportCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 22,
  },
  dashboardCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 22,
  },
  h2: { margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 10 },
  h3: { margin: 0, fontSize: 16, fontWeight: 700, marginBottom: 10 },
  p: { lineHeight: 1.6, margin: "8px 0" },
  topRow: { display: "flex", gap: 20, alignItems: "center" },
  scoreWrap: { position: "relative", width: 160, height: 160 },
  scoreCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  scoreNum: { fontSize: 28, fontWeight: 800, color: "#fff" },
  scoreLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  progressItem: { marginBottom: 14 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  percent: { opacity: 0.8 },
  progressBar: {
    width: "100%",
    height: 10,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: { height: "100%", background: "#22c55e" },
  sectionBlock: { marginTop: 16 },
  keywordRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  kwCol: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
  },
  kwHead: { fontWeight: 700, marginBottom: 8 },
  chipsWrap: { display: "flex", gap: 8, flexWrap: "wrap" },
  chipGreen: {
    background: "rgba(34,197,94,0.18)",
    border: "1px solid #22c55e",
    padding: "6px 10px",
    borderRadius: 16,
    fontSize: 13,
  },
  chipRed: {
    background: "rgba(239,68,68,0.18)",
    border: "1px solid #ef4444",
    padding: "6px 10px",
    borderRadius: 16,
    fontSize: 13,
  },
  dim: { opacity: 0.6 },

  summary: {lineHeight: 1.6, opacity: 0.95},
};
