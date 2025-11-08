import React from "react";

function Template1({ data }) {
  const skills = (data.skills || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div style={styles.page}>
      <h1 style={styles.name}>{data.name}</h1>
      <p style={styles.contact}>
        {data.email} • {data.phone}
      </p>

      

      <Section title="Professional Summary">
        <p style={styles.text}>{data.summary}</p>
      </Section>

      <Section title="Skills">
        <ul style={styles.list}>
          {skills.map((s, i) => (
            <li key={i} style={styles.listItem}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        <p style={styles.text}>{data.experience}</p>
      </Section>

      <Section title="Education">
        <p style={styles.text}>{data.education}</p>
      </Section>

      {/* Optional extra sections (ensure your demoData has these fields) */}
      {data.projects && (
        <Section title="Projects">
          <p style={styles.text}>{data.projects}</p>
        </Section>
      )}

      {data.achievements && (
        <Section title="Achievements">
          <p style={styles.text}>{data.achievements}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <h2 style={styles.heading}>{title}</h2>
      {children}
    </div>
  );
}

const styles = {
  // White “paper” that fills the A4 wrapper from MiniPreview / Form preview
  page: {
    width: "100%",
    minHeight: 1100,           // helps fill the A4 height
    backgroundColor: "#ffffff",
    padding: 40,
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },

  name: {
    margin: 0,
    fontSize: 32,
    color: "#222",
    fontWeight: "bold",
  },

  contact: {
    color: "#555",
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
  },

  heading: {
    fontSize: 18,
    margin: 0,
    paddingBottom: 4,
    marginBottom: 8,
    color: "#2e7d32",
    borderBottom: "2px solid #2e7d32",
    fontWeight: "bold",
  },

  // CRUCIAL: preserve newlines and wrap long strings
  text: {
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
    color: "#333",
    lineHeight: 1.5,
    margin: 0,
    marginTop: 6,
  },

  list: {
    marginTop: 8,
    paddingLeft: 18,
  },

  listItem: {
    color: "#333",
    lineHeight: 1.4,
    marginBottom: 4,
  },
};

export default Template1;