// src/pages/FormPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ResumePreview from "../components/preview/ResumePreview";
import { useReactToPrint } from "react-to-print";
import "./FormPage.css";

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
          `${e.degree || ""}${e.degree || e.school ? " — " : ""}${e.school || ""}${
            e.year ? ` (${e.year})` : ""
          }${e.details ? `\n${e.details}` : ""}`
      )
      .filter(Boolean)
      .join("\n\n") || "";

  const experience =
    (form.experience || [])
      .map((x) => {
        const bullets =
          String(x.bullets || "")
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean)
            .map((b) => `• ${b}`)
            .join("\n") || "";
        return `${x.role || ""}${x.role && x.company ? " — " : ""}${x.company || ""}${
          x.period ? ` (${x.period})` : ""
        }${bullets ? `\n${bullets}` : ""}`;
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
  const template =
    state?.template ||
    localStorage.getItem("chosen_template") ||
    "template1";

  // form state
  const [form, setForm] = useState({
    personal: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      leetcode: "",
    },
    education: [emptyEdu()],
    experience: [emptyExp()],
    skills: ["JavaScript", "React", "Node"],
    summary: "A short professional summary goes here.",
    projects: [{ title: "", description: "" }],
    achievements: [""],
  });

  const [step, setStep] = useState(1);

  // ---------- PRINTING ----------
  const printRefHidden = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRefHidden.current,
    documentTitle: "Resume",
  });

  // visible preview element (scaled)
  const previewPaperRef = useRef(null);
  const previewData = useMemo(() => composeData(form), [form]);

  /* ---------- preview scaling ---------- */
  const previewContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  useEffect(() => {
    function updateScaleAndOffsets() {
      const container = previewContainerRef.current;
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      const scaleH = ch / A4.H;
      const finalScale = Math.min(scaleH * 0.75, 1);
      const scaledW = A4.W * finalScale;
      const scaledH = A4.H * finalScale;
      const left = Math.max((cw - scaledW) / 2, 0);
      const top = Math.max((ch - scaledH) / 2, 0);

      setScale(finalScale);
      setOffset({ left, top });
    }

    updateScaleAndOffsets();

    let ro;
    try {
      ro = new ResizeObserver(updateScaleAndOffsets);
      if (previewContainerRef.current)
        ro.observe(previewContainerRef.current);
    } catch (e) {}
    window.addEventListener("resize", updateScaleAndOffsets);
    return () => {
      window.removeEventListener("resize", updateScaleAndOffsets);
      if (ro && previewContainerRef.current) ro.disconnect();
    };
  }, [previewData]);

  /* ---------- update helpers ---------- */
  const updatePersonal = (k, v) =>
    setForm((s) => ({ ...s, personal: { ...s.personal, [k]: v } }));

  const updateEducation = (idx, k, v) =>
    setForm((s) => {
      const arr = [...s.education];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...s, education: arr };
    });

  const addEducation = () =>
    setForm((s) => ({ ...s, education: [...s.education, emptyEdu()] }));

  const removeEducation = (idx) =>
    setForm((s) => ({
      ...s,
      education: s.education.filter((_, i) => i !== idx),
    }));

  const updateExperience = (idx, k, v) =>
    setForm((s) => {
      const arr = [...s.experience];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...s, experience: arr };
    });

  const addExperience = () =>
    setForm((s) => ({ ...s, experience: [...s.experience, emptyExp()] }));

  const removeExperience = (idx) =>
    setForm((s) => ({
      ...s,
      experience: s.experience.filter((_, i) => i !== idx),
    }));

  const updateSkill = (idx, v) =>
    setForm((s) => {
      const arr = [...s.skills];
      arr[idx] = v;
      return { ...s, skills: arr };
    });

  const addSkill = () =>
    setForm((s) => ({ ...s, skills: [...s.skills, ""] }));

  const removeSkill = (idx) =>
    setForm((s) => ({
      ...s,
      skills: s.skills.filter((_, i) => i !== idx),
    }));

  /* ---------- PROJECTS ---------- */
  const updateProject = (i, k, v) =>
    setForm((f) => {
      const arr = [...f.projects];
      arr[i] = { ...arr[i], [k]: v };
      return { ...f, projects: arr };
    });

  const addProject = () =>
    setForm((f) => ({
      ...f,
      projects: [...f.projects, { title: "", description: "" }],
    }));

  const removeProject = (i) =>
    setForm((f) => ({
      ...f,
      projects: f.projects.filter((_, idx) => idx !== i),
    }));

  /* ---------- ACHIEVEMENTS ---------- */
  const updateAchievement = (i, v) =>
    setForm((f) => {
      const arr = [...f.achievements];
      arr[i] = v;
      return { ...f, achievements: arr };
    });

  const addAchievement = () =>
    setForm((f) => ({ ...f, achievements: [...f.achievements, ""] }));

  const removeAchievement = (i) =>
    setForm((f) => ({
      ...f,
      achievements: f.achievements.filter((_, idx) => idx !== i),
    }));

  /* ---------- render ---------- */
  return (
    <div
      className="fp-page"
      style={{
        gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr ${PREVIEW_COL_WIDTH}px`,
      }}
    >
      {/* ---------- HIDDEN PRINTABLE COPY ---------- */}
      <div aria-hidden="true" className="fp-hidden-print">
        <div
          ref={printRefHidden}
          style={{
            width: A4.W,
            minHeight: A4.H,
            background: "#fff",
            color: "#000",
          }}
        >
          <ResumePreview data={previewData} template={template} />
        </div>
      </div>

      {/* LEFT SIDEBAR */}
      <aside className="fp-sidebar">
        <div className="fp-sidebarTopIcon">📄</div>

        <div className="fp-stepsContainer">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const isActive = n === step;
            const isDone = n < step;
            return (
              <div key={n} className="fp-stepWrapper">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setStep(n)}
                  onKeyDown={(e) => e.key === "Enter" && setStep(n)}
                  className="fp-stepCircle"
                  style={{
                    background: isActive
                      ? "#22c55e"
                      : isDone
                      ? "#3b82f6"
                      : "transparent",
                    color: isActive || isDone ? "#fff" : "#94a3b8",
                    borderColor: isActive
                      ? "#22c55e"
                      : isDone
                      ? "#3b82f6"
                      : "#475569",
                  }}
                >
                  {n}
                </div>
                {n !== 7 && <div className="fp-stepLine" />}
              </div>
            );
          })}
        </div>
      </aside>

      {/* FORM SECTION */}
      <main className="fp-formSection">
        <h1 className="fp-bigTitle">Let’s start with your header</h1>
        <p className="fp-subtitle">
          Include your full name and at least one way for employers to reach
          you.
        </p>

        {/* Step 1 */}
        {step === 1 && (
          <div className="fp-formGrid">
            <Field
              label="First Name"
              value={form.personal.name}
              onChange={(v) => updatePersonal("name", v)}
            />
            <Field
              label="Surname"
              value={form.personal.surname}
              onChange={(v) => updatePersonal("surname", v)}
            />
            <Field
              label="Phone"
              value={form.personal.phone}
              onChange={(v) => updatePersonal("phone", v)}
            />
            <Field
              label="Email"
              value={form.personal.email}
              onChange={(v) => updatePersonal("email", v)}
            />
          </div>
        )}

        {/* Other steps remain unchanged (2–7) */}
        {/* ... */}
      </main>

      {/* PREVIEW SECTION */}
      <aside className="fp-previewSection">
        <div className="fp-previewGlass" ref={previewContainerRef}>
          <div
            ref={previewPaperRef}
            className="fp-previewPaper"
            style={{
              width: A4.W,
              height: A4.H,
              transform: `scale(${scale})`,
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

/* ---------- small UI field ---------- */
function Field({ label, value, onChange }) {
  return (
    <div className="fp-field">
      <label className="fp-fieldLabel">{label}</label>
      <input
        className="fp-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
      />
    </div>
  );
}
