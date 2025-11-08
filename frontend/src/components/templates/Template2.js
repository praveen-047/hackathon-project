import React from "react";

function Template2({ data }) {
  const skills = (data.skills || "").split(",").map(s => s.trim());

  return (
    <div style={styles.page}>
      {/* LEFT SIDEBAR */}
      <div style={styles.left}>
        <h2 style={styles.leftTitle}>Contact</h2>
        <p style={styles.leftText}>{data.email}</p>
        <p style={styles.leftText}>{data.phone}</p>

        {data.github && (
  <p style={styles.leftText}>
    <strong>GitHub:</strong> {data.github}
  </p>
)}

{data.linkedin && (
  <p style={styles.leftText}>
    <strong>LinkedIn:</strong> {data.linkedin}
  </p>
)}

{data.leetcode && (
  <p style={styles.leftText}>
    <strong>LeetCode:</strong> {data.leetcode}
  </p>
)}


        <h2 style={styles.leftTitle}>Skills</h2>
        <ul style={styles.list}>
          {skills.map((s, i) => (
            <li key={i} style={styles.listItem}>{s}</li>
          ))}
        </ul>
      </div>

      {/* RIGHT MAIN */}
      <div style={styles.right}>
        <h1 style={styles.name}>{data.name}</h1>

        <Section title="Professional Summary" content={data.summary} />
        <Section title="Experience" content={data.experience} />
        <Section title="Education" content={data.education} />
        <Section title="Projects" content={data.projects} />
        <Section title="Achievements" content={data.achievements} />
      </div>
    </div>
  );
}

function Section({ title, content }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{content}</p>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    width: "100%",
    minHeight: "1100px",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
  },

  left: {
    background: "#f0f4ff",
    padding: 30,
    borderRight: "2px solid #d0d7ff",
  },

  leftTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
    marginTop: 20,
    marginBottom: 8,
  },

  leftText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },

  list: { paddingLeft: 18 },
  listItem: { fontSize: 14, color: "#333", marginBottom: 4 },

  right: {
    padding: 40,
  },

  name: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    color: "#1e40af",
    borderBottom: "2px solid #1e40af",
    paddingBottom: 4,
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 14,
    whiteSpace: "pre-line",
    color: "#444",
    lineHeight: 1.5,
  },
};

export default Template2;