import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie"
import { Link } from "react-router-dom";
import "./index.css";

export default function Candidate() {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        const res = await fetch("http://localhost:5000/candidate/jobs", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt_token")}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setJobsList(data);
        } else {
          setError(data.message || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Something went wrong while fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobsData();
  }, []);

  // ✅ Intersection Observer for fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target); // only animate once
          }
        });
      },
      { threshold: 0.1 } // trigger when 10% visible
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [jobsList]);



   const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  // ✅ Submit Application
  const handleApply = async () => {
    if (!resume) {
      alert("Please upload your resume first.");
      return;
    }

    const token = Cookies.get("jwt_token");
    const formData = new FormData();
    formData.append("jobId", selectedJob.id);
    formData.append("resume", resume);

    try {
      const res = await fetch("http://localhost:5000/candidate/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Application submitted successfully!");
        setShowModal(false);
        setResume(null);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error applying:", err);
      alert("Something went wrong while applying.");
    }
  };

  return (
    <>
    <div className="candidate-container">
      <div className="candidate-container-header">
        <p>Current Job Openings</p>
        <p>username profile</p>
      </div>

      {loading ? (
        <p className="loading">Loading jobs...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="jobs-list">
          {jobsList.length === 0 ? (
            <p>No job openings available.</p>
          ) : (
            jobsList.map((job, index) => (
              <div
                className="job-card"
                key={job.id}
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <span className="badge">Actively hiring</span>
                  </div>
                </div>

                <div className="job-details">
                  <p>📍 {job.location || "Not specified"}</p>
                  <p>💰 {job.salary || "Negotiable"}</p>
                  <p>💼 {job.experience || "Experience not mentioned"}</p>
                </div>

                <div className="job-description">
                  <p>
                    <strong>Job title:</strong> {job.title} —{" "}
                    {job.description}
                  </p>
                </div>

                <div className="job-tags">
                  {job.requirements
                    ? job.requirements
                        .split(",")
                        .slice(0, 5)
                        .map((req, index) => (
                          <span key={index} className="tag">
                            {req.trim()}
                          </span>
                        ))
                    : null}
                </div>

                <div className="job-footer">
                  <p className="posted-time">📅 4 days ago</p>
                  <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openApplyModal(job);
                }}
                className="apply-btn"
              >
                Apply Now
              </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* ✅ Apply Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Apply for {selectedJob.title}</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <div className="modal-actions">
              <button onClick={handleApply} className="apply-btn">
                Submit Application
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="fixed-buttons">
  <Link to='/build-resume'><button className="btn-primary">Build Your Resume</button></Link>
  <Link to='/check-ats'><button className="btn-primary">Check ATS score</button></Link>
</div>
    </>
  );
}
