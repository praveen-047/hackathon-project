import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniPreview from "../components/templates/MiniPreview";
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";
import Template3 from "../components/templates/Template3";
// import Template4 from "../components/templates/Template4";
// import Template5 from "../components/templates/Template5";
// import Template6 from "../components/templates/Template6";
// (later we will add 7–12)


const demo = {
  name: "ALEXANDER JOHN CARTER",
  email: "alex.carter@example.com",
  phone: "+91 98765 43210",

  summary:
    "Dedicated and detail-oriented Software Engineer with 3+ years of experience in building scalable web applications, REST APIs, \
and cloud-native solutions. Strong problem-solving skills with expertise in JavaScript, React, Node.js, and Python. Passionate about \
creating user-centric products, optimizing performance, and implementing modern engineering practices. Proven ability to collaborate \
with cross-functional teams and deliver high-quality software within deadlines.",

  skills:
    "JavaScript, React.js, Node.js, Express.js, MongoDB, PostgreSQL",

  experience:
    "Software Engineer — TechNova Solutions (2021–Present)\n\
• Built scalable REST APIs using Node.js and Express, improving request handling by 35%.\n\
• Integrated AWS services (S3, Lambda, CloudWatch) for cloud-based automation.\n\
\n\
Software Developer Intern — CyberEdge Pvt Ltd (2020–2021)\n\
• Assisted in building analytics dashboards using React and Chart.js.\n\
• Worked closely with QA team to fix bugs, improving software stability.\n",

  education:
    "Bachelor of Technology in Computer Science\n\
National Institute of Technology — 2021\n\
CGPA: 8.74/10\n\n\
Certifications:\n\
• AWS Certified Solutions Architect – Associate\n\
• Google Data Analytics Professional Certificate\n",

  projects:
    "AI-Powered Resume Builder\n\
• Developed an AI-assisted resume generator using React and OpenAI.\n\
• Created 10+ dynamic resume templates with PDF export.\n\
\n\
E-Commerce Dashboard\n\
• Built inventory + analytics dashboard using MERN stack.\n\
• Implemented JWT auth, sales charts, and order tracking modules.\n",

  achievements:
    "• 1st place — Smart India Hackathon 2022\n\
• Awarded 'Employee of the Quarter' for Q1 2024\n\
• Published 2 research papers on Machine Learning optimization\n\
• Speaker at JSConf India 2023\n",
};



function TemplatesChoose() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const chooseAndNext = () => {
    if (!selected) return;
    // persist for next page & fallback
    localStorage.setItem("chosen_template", selected);
    navigate("/FormPage", { state: { template: selected } });
  };

  return (
    <div style={page}>
      <h1 style={title}>Choose Your Resume Template</h1>
      <p style={subtitle}>Preview and select a template to continue</p>

      <div style={grid}>
        <Card name="Template 1" isSelected={selected==="template1"} onSelect={() => setSelected("template1")}>
          <MiniPreview><Template1 data={demo} /></MiniPreview>
        </Card>

        <Card name="Template 2" isSelected={selected==="template2"} onSelect={() => setSelected("template2")}>
          <MiniPreview><Template2 data={demo} /></MiniPreview>
        </Card>

        <Card name="Template 3" isSelected={selected==="template3"} onSelect={() => setSelected("template3")}>
          <MiniPreview><Template3 data={demo} /></MiniPreview>
        </Card>

        {/* <Card name="Template 4" isSelected={selected === "template4"} onSelect={() => setSelected("template4")} >
          <MiniPreview><Template4 data={demo} /></MiniPreview>
        </Card>

        <Card name="Template 5" isSelected={selected === "template5"} onSelect={() => setSelected("template5")} >
          <MiniPreview><Template4 data={demo} /></MiniPreview>
        </Card>

        <Card name="Template 6" isSelected={selected === "template6"} onSelect={() => setSelected("template6")} >
          <MiniPreview><Template4 data={demo} /></MiniPreview>
        </Card> */}

      </div>

        

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button
          onClick={chooseAndNext}
          disabled={!selected}
          style={{
            padding: "12px 18px",
            borderRadius: 10,
            background: "#22c55e",
            color: "black",
            fontWeight: "bold",
            border: "none",
            opacity: selected ? 1 : 0.5,
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function Card({ children, name, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: 16,
        borderRadius: 16,
        background: "rgba(255,255,255,0.05)",
        border: isSelected ? "3px solid #3b82f6" : "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {children}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "#fff", fontWeight: 600 }}>{name}</div>
        <button style={{
          padding: "8px 12px",
          borderRadius: 10,
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          cursor: "pointer"
        }}>
          Choose
        </button>
      </div>
    </div>
  );
}

/* styles */
const page = { minHeight: "100vh", padding: 24, color: "white" };
const title = { textAlign: "center", fontSize: 32, fontWeight: "bold", marginBottom: 6 };
const subtitle = { textAlign: "center", color: "#aaa", marginBottom: 24 };
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(280px, 1fr))",
  gap: 20,
  maxWidth: 1120,
  margin: "0 auto",
};

export default TemplatesChoose;