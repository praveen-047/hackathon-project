// src/pages/FormPage.js
import{ useEffect, useMemo, useRef, useState } from "react";


import { useLocation } from "react-router-dom";
import ResumePreview from "../components/preview/ResumePreview";
import { useReactToPrint } from "react-to-print";

/* ---------- constants ---------- */
const A4 = { W: 850, H: 1100 }; // A4 used by templates (pixels)
const SIDEBAR_WIDTH = 90; // left column width
const PREVIEW_COL_WIDTH = 650; // right column width (kept fixed)

/* ---------- small helpers ---------- */
const emptyEdu = () => ({ school: "", degree: "", year: "", details: "" });
const emptyExp = () => ({ role: "", company: "", period: "", bullets: "" });

function composeData(form) {
  const education =
    (form.education || [])
      .map(
        (e) =>
          `${e.degree || ""}${e.degree || e.school ? " — " : ""}${e.school || ""}${e.year ? ` (${e.year})` : ""}${
            e.details ? `\n${e.details}` : ""
          }`
      )
      .filter(Boolean)
      .join("\n\n") || "";

  const experience =
    (form.experience || [])
      .map((x) => {
        const bullets =
          (String(x.bullets || "")
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean)
            .map((b) => `• ${b}`)
            .join("\n")) || "";
        return `${x.role || ""}${x.role && x.company ? " — " : ""}${x.company || ""}${x.period ? ` (${x.period})` : ""}${
          bullets ? `\n${bullets}` : ""
        }`;
      })
      .filter(Boolean)
      .join("\n\n") || "";

  const projects =
    (form.projects || [])
      .map((p) => {
        const t = (p.title || "").trim();
        const d = (p.description || "").trim();
        return t && d ? `${t}\n${d}` : t || d || "";
      })
      .filter(Boolean)
      .join("\n\n") || "";

  const achievements =
    (form.achievements || [])
      .map((a) => a && a.trim())
      .filter(Boolean)
      .join("\n• ") || "";

  return {
    name: (form.personal.name || "Your Name").trim(),
    email: form.personal.email || "",
    phone: form.personal.phone || "",
    github: form.personal.github || "",
linkedin: form.personal.linkedin || "",
leetcode: form.personal.leetcode || "",

    summary: form.summary || "",
    skills: (form.skills || []).join(", "),
    education,
    experience,
    projects,
    achievements: achievements ? `• ${achievements}` : "",
  };
}

/* ---------- main component ---------- */
export default function FormPage() {
  const { state } = useLocation();
  const template = state?.template || localStorage.getItem("chosen_template") || "template1";

  // form state
  const [form, setForm] = useState({
    personal: { name: "", email: "", phone: "", github: "", linkedin: "", leetcode: "" },
    education: [emptyEdu()],
    experience: [emptyExp()],
    skills: ["JavaScript", "React", "Node"],
    summary: "A short professional summary goes here.",
    projects: [{ title: "", description: "" }],
    achievements: [""],
  });

  const [step, setStep] = useState(1);

  // ---------- PRINTING ----------
  // hidden print element (always in DOM) -> used by react-to-print
  const printRefHidden = useRef(null);
const handlePrint = useReactToPrint({
  contentRef: printRefHidden,
  documentTitle: "Resume"
});


  // visible preview element (scaled) - separate ref
  const previewPaperRef = useRef(null);

  // data for preview (recomputes when form changes)
  const previewData = useMemo(() => composeData(form), [form]);

  /* ---------- preview scaling state (Option C - full-height preview) ---------- */
  const previewContainerRef = useRef(null); // frosted glass container
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  useEffect(() => {
    function updateScaleAndOffsets() {
      const container = previewContainerRef.current;
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      // Fit by height (full-height preview). Then zoom out by factor (0.75) to leave margins
      const scaleH = ch / A4.H;
      const finalScale = Math.min(scaleH * 0.75, 1); // tweak 0.75 to change zoom amount

      // compute offsets to center the scaled A4 inside container
      const scaledW = A4.W * finalScale;
      const scaledH = A4.H * finalScale;
      const left = Math.max((cw - scaledW) / 2, 0);
      const top = Math.max((ch - scaledH) / 2, 0);

      setScale(finalScale);
      setOffset({ left, top });
    }

    updateScaleAndOffsets();

    // use ResizeObserver when available to react to container changes
    let ro;
    try {
      ro = new ResizeObserver(updateScaleAndOffsets);
      if (previewContainerRef.current) ro.observe(previewContainerRef.current);
    } catch (e) {
      // ignore if ResizeObserver not supported
    }
    window.addEventListener("resize", updateScaleAndOffsets);
    return () => {
      window.removeEventListener("resize", updateScaleAndOffsets);
      if (ro && previewContainerRef.current) ro.disconnect();
    };
  }, [previewData]);

  /* ---------- update helpers ---------- */
  const updatePersonal = (k, v) => setForm((s) => ({ ...s, personal: { ...s.personal, [k]: v } }));
  const updateEducation = (idx, k, v) =>
    setForm((s) => {
      const arr = [...s.education];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...s, education: arr };
    });
  const addEducation = () => setForm((s) => ({ ...s, education: [...s.education, emptyEdu()] }));
  const removeEducation = (idx) => setForm((s) => ({ ...s, education: s.education.filter((_, i) => i !== idx) }));

  const updateExperience = (idx, k, v) =>
    setForm((s) => {
      const arr = [...s.experience];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...s, experience: arr };
    });
  const addExperience = () => setForm((s) => ({ ...s, experience: [...s.experience, emptyExp()] }));
  const removeExperience = (idx) => setForm((s) => ({ ...s, experience: s.experience.filter((_, i) => i !== idx) }));

  const updateSkill = (idx, v) =>
    setForm((s) => {
      const arr = [...s.skills];
      arr[idx] = v;
      return { ...s, skills: arr };
    });
  const addSkill = () => setForm((s) => ({ ...s, skills: [...s.skills, ""] }));
  const removeSkill = (idx) => setForm((s) => ({ ...s, skills: s.skills.filter((_, i) => i !== idx) }));

  /* ---------- PROJECTS ---------- */
  const updateProject = (i, k, v) =>
    setForm((f) => {
      const arr = [...f.projects];
      arr[i] = { ...arr[i], [k]: v };
      return { ...f, projects: arr };
    });
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, { title: "", description: "" }] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  /* ---------- ACHIEVEMENTS ---------- */
  const updateAchievement = (i, v) =>
    setForm((f) => {
      const arr = [...f.achievements];
      arr[i] = v;
      return { ...f, achievements: arr };
    });
  const addAchievement = () => setForm((f) => ({ ...f, achievements: [...f.achievements, ""] }));
  const removeAchievement = (i) => setForm((f) => ({ ...f, achievements: f.achievements.filter((_, idx) => idx !== i) }));

  /* ---------- render ---------- */
  return (
    <div style={styles.page}>
      {/* ---------- HIDDEN PRINTABLE COPY (ALWAYS MOUNTED) ---------- */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -99999,
          left: -99999,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={printRefHidden} style={{ width: A4.W, minHeight: A4.H, background: "#fff", color: "#000" }}>
          <ResumePreview data={previewData} template={template} />
        </div>
      </div>

      {/* LEFT SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTopIcon}>📄</div>

        <div style={styles.stepsContainer}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const isActive = n === step;
            const isDone = n < step;
            return (
              <div key={n} style={styles.stepWrapper}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setStep(n)}
                  onKeyDown={(e) => e.key === "Enter" && setStep(n)}
                  style={{
                    ...styles.stepCircle,
                    background: isActive ? "#22c55e" : isDone ? "#3b82f6" : "transparent",
                    color: isActive || isDone ? "#fff" : "#94a3b8",
                    borderColor: isActive ? "#22c55e" : isDone ? "#3b82f6" : "#475569",
                  }}
                >
                  {n}
                </div>
                {n !== 7 && <div style={styles.stepLine} />}
              </div>
            );
          })}
        </div>
      </aside>

      {/* FORM SECTION (scrollable column) */}
      <main style={styles.formSection}>
        <h1 style={styles.bigTitle}>Let’s start with your header</h1>
        <p style={styles.subtitle}>Include your full name and at least one way for employers to reach you.</p>

        {/* Step 1 */}
        {step === 1 && (
          <div style={styles.formGrid}>
            <Field label="First Name" value={form.personal.name} onChange={(v) => updatePersonal("name", v)} />
            <Field label="Surname" value={form.personal.surname} onChange={(v) => updatePersonal("surname", v)} />
            <Field label="Phone" value={form.personal.phone} onChange={(v) => updatePersonal("phone", v)} />
            <Field label="Email" value={form.personal.email} onChange={(v) => updatePersonal("email", v)} />
          </div>
        )}

        {/* Step 2 */}
{step === 2 && (
  <div>
    <label style={styles.fieldLabel}>Professional Summary</label>
    <textarea
      style={styles.textarea}
      value={form.summary}
      onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
      placeholder="Describe yourself in 3–4 lines..."
    />

    {/* Social Links */}
    <h3 style={{ marginTop: 20, marginBottom: 10 }}>Social Profiles</h3>

    <Field
      label="GitHub URL"
      value={form.personal.github}
      onChange={(v) => updatePersonal("github", v)}
    />

    <Field
      label="LinkedIn URL"
      value={form.personal.linkedin}
      onChange={(v) => updatePersonal("linkedin", v)}
    />

    <Field
      label="LeetCode URL"
      value={form.personal.leetcode}
      onChange={(v) => updatePersonal("leetcode", v)}
    />
    </div>
)}


        {/* Step 3 */}
        {step === 3 && (
          <div>
            <label style={styles.fieldLabel}>Your Skills</label>
            {(form.skills || []).map((skill, idx) => (
              <div key={idx} style={styles.skillRow}>
                <input style={styles.input} value={skill} onChange={(e) => updateSkill(idx, e.target.value)} placeholder="Skill" />
                <button style={styles.removeBtn} onClick={() => removeSkill(idx)}>
                  ✖
                </button>
              </div>
            ))}
            <button style={styles.addBtn} onClick={addSkill}>
              + Add Skill
            </button>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h3 style={styles.sectionTitle}>Education</h3>
            {form.education.map((edu, idx) => (
              <div key={idx} style={styles.eduCard}>
                <Field label="School / University" value={edu.school} onChange={(v) => updateEducation(idx, "school", v)} />
                <Field label="Degree / Program" value={edu.degree} onChange={(v) => updateEducation(idx, "degree", v)} />
                <Field label="Year" value={edu.year} onChange={(v) => updateEducation(idx, "year", v)} />
                <div style={{ marginTop: 10 }}>
                  <button style={styles.removeBtn} onClick={() => removeEducation(idx)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button style={styles.addBtn} onClick={addEducation}>
              + Add Education
            </button>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div>
            <h3 style={styles.sectionTitle}>Work Experience</h3>
            {form.experience.map((ex, idx) => (
              <div key={idx} style={styles.eduCard}>
                <Field label="Role / Title" value={ex.role} onChange={(v) => updateExperience(idx, "role", v)} />
                <Field label="Company" value={ex.company} onChange={(v) => updateExperience(idx, "company", v)} />
                <Field label="Duration" value={ex.period} onChange={(v) => updateExperience(idx, "period", v)} />
                <label style={styles.fieldLabel}>Bullets (one per line)</label>
                <textarea style={styles.textarea} value={ex.bullets} onChange={(e) => updateExperience(idx, "bullets", e.target.value)} />
                <div style={{ marginTop: 10 }}>
                  <button style={styles.removeBtn} onClick={() => removeExperience(idx)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button style={styles.addBtn} onClick={addExperience}>
              + Add Experience
            </button>
          </div>
        )}

        {/* Step 6 (Projects + Achievements) */}
        {step === 6 && (
          <div>
            <h2 style={styles.sectionTitle}>Projects</h2>

            {form.projects.map((p, idx) => (
              <div key={idx} style={styles.eduCard}>
                <Field label="Project Title" value={p.title} onChange={(v) => updateProject(idx, "title", v)} />

                <label style={styles.fieldLabel}>Project Description</label>
                <textarea
                  style={styles.textarea}
                  value={p.description}
                  onChange={(e) => updateProject(idx, "description", e.target.value)}
                  placeholder="Explain what the project does, your role, tools used..."
                />

                <button style={styles.removeBtn} onClick={() => removeProject(idx)}>
                  Delete Project
                </button>

                <hr style={{ borderColor: "#334155", margin: "20px 0" }} />
              </div>
            ))}

            <button style={styles.addBtn} onClick={addProject}>
              + Add Project
            </button>

            <h2 style={{ ...styles.sectionTitle, marginTop: 20 }}>Achievements</h2>

            {form.achievements.map((a, idx) => (
              <div key={idx} style={styles.skillRow}>
                <input style={styles.input} value={a} onChange={(e) => updateAchievement(idx, e.target.value)} placeholder="Achievement" />
                <button style={styles.removeBtn} onClick={() => removeAchievement(idx)}>
                  ✖
                </button>
              </div>
            ))}

            <button style={styles.addBtn} onClick={addAchievement}>
              + Add Achievement
            </button>
          </div>
        )}

        {/* Step 7 - Final Review */}
        {step === 7 && (
          <div style={{ padding: 20 }}>
            <h1 style={styles.bigTitle}>Your Resume is Ready ✅</h1>
            <p style={styles.subtitle}>You can now download or change templates.</p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button style={styles.primaryBtn} onClick={handlePrint}>
                Download PDF
              </button>

            </div>
          </div>
        )}

        {/* nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <div>
            <button style={styles.navBtn} onClick={() => setStep((s) => Math.max(1, s - 1))}>
              ← Back
            </button>
          </div>

          <div>
            <button style={styles.navBtn} onClick={() => setStep((s) => Math.min(7, s + 1))}>
              Next →
            </button>
            <button
              style={{ ...styles.navBtn, marginLeft: 8 }}
              onClick={() => {
                setStep(5);
              }}
            >
              Review
            </button>
          </div>
        </div>
      </main>

      {/* PREVIEW COLUMN (frosted glass) */}
      <aside style={styles.previewSection}>
        

        <div style={styles.previewGlass} ref={previewContainerRef}>
          <div
            ref={previewPaperRef}
            style={{
              ...styles.previewPaper,
              width: A4.W,
              height: A4.H,
              left: offset.left,
              top: offset.top,
            }}
          >
            <ResumePreview data={previewData} template={template} />
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------- small UI pieces ---------- */
function Field({ label, value, onChange }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input style={styles.input} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={label} />
    </div>
  );
}

/* ---------- styles ---------- */
const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr ${PREVIEW_COL_WIDTH}px`,
    gap: 20,
    minHeight: "100vh",
    background: "black",
    color: "#fff",
  },

  /* sidebar */
  sidebar: {
    background: "#0f172a",
    paddingTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sidebarTopIcon: { fontSize: 28, marginBottom: 22 },

  stepsContainer: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },
  stepWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "2px solid #475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  stepLine: { width: 2, height: 36, background: "#475569", marginTop: 6 },

  /* form column (fixed height and scrollable) */
  formSection: {
    padding: 32,
    overflowY: "auto",
    height: "100vh",
    boxSizing: "border-box",
  },

  bigTitle: { fontSize: 26, fontWeight: 800, margin: 0 },
  subtitle: { color: "#9ca3af", marginBottom: 18 },

  formGrid: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 },

  field: { display: "flex", flexDirection: "column", marginBottom: 8 },
  fieldLabel: { color: "#cbd5e1", marginBottom: 6, fontWeight: 600 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#fff",
    minHeight: 140,
    resize: "vertical",
    fontSize: 15,
  },

  finalPreviewContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 20,
  },

  finalPreviewPaper: {
    width: A4.W,
    height: A4.H,
    background: "#fff",
    color: "#000",
    borderRadius: 8,
    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },

  navBtn: {
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },

  primaryBtn: {
    padding: "9px 14px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "#000",
    cursor: "pointer",
    fontWeight: 700,
  },

  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 8 },

  addBtn: { background: "#3b82f6", color: "#fff", padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginTop: 8 },
  removeBtn: { background: "#ef4444", color: "#fff", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer" },

  eduCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: 14, borderRadius: 10, marginBottom: 12 },

  skillRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },

  /* preview column */
  previewSection: {
    padding: 5,
    borderLeft: "1px solid rgba(255,255,255,0.03)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxSizing: "border-box",
  },
  previewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  smallLink: { background: "transparent", border: "none", color: "#60a5fa", cursor: "pointer", fontWeight: 700 },

  /* frosted glass */
  previewGlass: {
    position: "relative",
    flex: 1,
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)", // soft frosted
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* resume element absolute (A4) - scaled & positioned inline */
  previewPaper: {
    position: "absolute",
    transformOrigin: "top left",
    boxShadow: "0 6px 30px rgba(0,0,0,0.45)",
    borderRadius: 6,
    overflow: "hidden",
    background: "#fff",
    color: "#000",
  },
};