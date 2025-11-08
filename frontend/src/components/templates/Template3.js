import React from "react";

function Template3({ data }) {
  const skills = (data.skills || "").split(",").map(s => s.trim());

  return (
    <div style={styles.page}>
      {/* LEFT DARK SIDEBAR */}
      <div style={styles.sidebar}>
        <h1 style={styles.name}>{data.name}</h1>
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


        <h2 style={styles.sbTitle}>Contact</h2>
        <p style={styles.sbText}>{data.email}</p>
        <p style={styles.sbText}>{data.phone}</p>

        <h2 style={styles.sbTitle}>Skills</h2>
        <ul style={styles.list}>
          {skills.map((s, i) => (
            <li key={i} style={styles.listItem}>{s}</li>
          ))}
        </ul>
      </div>

      {/* RIGHT WHITE BODY */}
      <div style={styles.content}>
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
    <div style={{ marginBottom: 20 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{content}</p>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    background: "#fff",
    width: "100%",
    minHeight: "1100px",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    background: "#1f2937",
    color: "#fff",
    padding: 30,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  sbTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93c5fd",
    marginTop: 20,
    marginBottom: 8,
  },

  sbText: {
    color: "#ddd",
    marginBottom: 6,
    fontSize: 14,
  },

  list: { paddingLeft: 20 },
  listItem: { color: "#eee", marginBottom: 4 },

  content: { padding: 40 },

  sectionTitle: {
    fontSize: 20,
    color: "#1f2937",
    borderBottom: "2px solid #1f2937",
    paddingBottom: 4,
    marginBottom: 8,
  },

  sectionText: {
    whiteSpace: "pre-line",
    color: "#444",
    fontSize: 14,
    lineHeight: 1.5,
  },
};

export default Template3;