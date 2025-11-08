import { useState,useEffect } from "react";
import { jobPost, blogPost } from "../../api";
import GlassMessage from "../../components/GlassMessage";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const Admin = () => {
  const [activeTab, setActiveTab] = useState("job");

  const [message, setMessage] = useState("");

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    experience: "Fresher",
    salary: "",
    description: "",
    requirements: "",
    applyLink: "",
    deadline: "",
  });


  const navigate = useNavigate();

const handleLogout = () => {
  Cookies.remove("jwt_token");

  
  navigate("/login");
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const jobPostSuccess = () => {
    setMessage("Job post created successfully! 🎉"); // show success message

    // clear form fields
    setJobData({
      title: "",
      company: "",
      location: "",
      type: "Full-Time",
      experience: "Fresher",
      salary: "",
      description: "",
      requirements: "",
      applyLink: "",
      deadline: "",
    });

    // wait 3 seconds before redirect (optional)
    setTimeout(() => {
      // navigate("/admin"); // uncomment if you want to redirect
    }, 3000);
  };

  const jobPostFailure = (error) => {
    setMessage("Job post failed ❌");
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();

    try {
      const newJob = { ...jobData };
      console.log("✅ New Job Post Created:", newJob);

      const data = await jobPost(newJob); // call backend API

      if (data?.message === "Job post created successfully") {
        jobPostSuccess();
      } else {
        jobPostFailure(data?.message || "Unexpected error occurred");
      }
    } catch (error) {
      console.error("Job post error:", error);
      jobPostFailure("Something went wrong while creating the job post");
    }
  };

  // blog postv functionality

  // 🔹 Blog Post Functionality

  const [blogData, setBlogData] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    category: "Company Update",
    publishDate: "",
  });

  // handle input changes
  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  // success handler
  const blogPostSuccess = () => {
    setMessage("Blog post published successfully! 🎉"); // show success message

    // clear form fields
    setBlogData({
      title: "",
      summary: "",
      content: "",
      image: "",
      category: "Company Update",
      publishDate: "",
    });

    // wait 3 seconds before redirect (optional)
    setTimeout(() => {
      // navigate("/admin"); // uncomment if you want to redirect
    }, 3000);
  };

  // failure handler
  const blogPostFailure = (error) => {
    console.error("❌ Blog post failed:", error);
    setMessage("Blog post failed ❌");
  };

  // main submit handler
  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    try {
      const newBlog = { ...blogData };
      console.log("📝 New Blog Post:", newBlog);

      const data = await blogPost(newBlog); // backend API call (same style as jobPost)

      if (data?.message === "Blog post created successfully") {
        blogPostSuccess();
      } else {
        blogPostFailure(data?.message || "Unexpected error occurred");
      }
    } catch (error) {
      console.error("Blog post error:", error);
      blogPostFailure("Something went wrong while publishing the blog");
    }
  };




  //recived applications
  const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");


useEffect(() => {
  if (activeTab === "applications") {
    fetchApplications();
  }
}, [activeTab]);

const fetchApplications = async () => {
  setLoading(true);
  setError("");
  try {
    const token = Cookies.get("jwt_token");
    const res = await fetch("http://localhost:5000/admin/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setApplications(data);
    } else {
      setError(data.message || "Failed to fetch applications");
    }
  } catch (err) {
    console.error("Error fetching applications:", err);
    setError("Something went wrong while fetching applications");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="admin-container">
      <div className="admin-tabs">
        <p
          className={activeTab === "job" ? "tab active" : "tab"}
          onClick={() => setActiveTab("job")}
        >
          Create Job Post
        </p>
        <p
          className={activeTab === "blog" ? "tab active" : "tab"}
          onClick={() => setActiveTab("blog")}
        >
          Create Blog Post
        </p>
        <p
          className={activeTab === "applications" ? "tab active" : "tab"}
          onClick={() => setActiveTab("applications")}
        >
          Received Applications
        </p>
      </div>
      <div>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>

      

      {activeTab === "job" && (
        <div className="job-post-container glass-card">
          <GlassMessage message={message} />
          <h2 className="section-title">Create Job Post</h2>

          <form className="styled-form" onSubmit={handleJobSubmit}>
            {/* ------------- Job Title ------------- */}
            <div className="form-row">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                required
              />
            </div>

            <div className="form-row">
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g., Techify Solutions Pvt Ltd"
                required
              />
            </div>

            <div className="form-grid">
              <div>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote or Chennai, India"
                />
              </div>

              <div>
                <label>Job Type</label>
                <select
                  name="type"
                  value={jobData.type}
                  onChange={handleChange}
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>

              <div>
                <label>Experience Level</label>
                <select
                  name="experience"
                  value={jobData.experience}
                  onChange={handleChange}
                >
                  <option>Fresher</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Salary Range</label>
              <input
                type="text"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="e.g., ₹4–8 LPA"
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Brief description about the job responsibilities..."
              />
            </div>

            <div className="form-row">
              <label>Requirements</label>
              <textarea
                name="requirements"
                rows="3"
                value={jobData.requirements}
                onChange={handleChange}
                placeholder="e.g., Strong in HTML, CSS, JavaScript, and React.js"
              />
            </div>

            <div className="form-grid">
              <div>
                <label>Apply Link / Email</label>
                <input
                  type="text"
                  name="applyLink"
                  value={jobData.applyLink}
                  onChange={handleChange}
                  placeholder="e.g., careers@techify.com or https://techify.in/careers"
                />
              </div>

              <div>
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="primary-btn">
              Create Job Post
            </button>
          </form>
        </div>
      )}

      {/* BLOG SECTION */}
      {activeTab === "blog" && (
        <div className="blog-post-container glass-card">
          <GlassMessage message={message} />
          <h2 className="section-title">Create Blog Post / Company Update</h2>

          <form className="styled-form" onSubmit={handleBlogSubmit}>
            <div className="form-row">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={blogData.title}
                onChange={handleBlogChange}
                placeholder="e.g., How We Scaled Our Tech Team to 100 Engineers"
                required
              />
            </div>

            <div className="form-row">
              <label>Short Summary</label>
              <input
                type="text"
                name="summary"
                value={blogData.summary}
                onChange={handleBlogChange}
                placeholder="A short overview of what this post is about"
                required
              />
            </div>

            <div className="form-row">
              <label>Content</label>
              <textarea
                name="content"
                rows="6"
                value={blogData.content}
                onChange={handleBlogChange}
                placeholder="Write the full article content here..."
                required
              />
            </div>

            <div className="form-grid">
              <div>
                <label>Image URL (optional)</label>
                <input
                  type="text"
                  name="image"
                  value={blogData.image}
                  onChange={handleBlogChange}
                  placeholder="e.g., https://techify.in/images/update-banner.jpg"
                />
              </div>

              <div>
                <label>Category / Tag</label>
                <select
                  name="category"
                  value={blogData.category}
                  onChange={handleBlogChange}
                >
                  <option>Company Update</option>
                  <option>Announcement</option>
                  <option>Career Tips</option>
                  <option>Event</option>
                  <option>Technology</option>
                </select>
              </div>

              <div>
                <label>Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={blogData.publishDate}
                  onChange={handleBlogChange}
                />
              </div>
            </div>

            <button type="submit" className="primary-btn">
              Publish Blog Post
            </button>
          </form>
        </div>
      )}

      {activeTab === "applications" && (
  <div className="received-applications-container glass-card">
    <h2 className="section-title">Received Applications</h2>

    {loading ? (
      <p>Loading applications...</p>
    ) : error ? (
      <p className="error">{error}</p>
    ) : applications.length === 0 ? (
      <p>No applications found.</p>
    ) : (
      <table className="applications-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Job Title</th>
            <th>Resume</th>
            <th>Applied At</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.application_id}>
              <td>{app.username}</td>
              <td>{app.email}</td>
              <td>{app.mobile}</td>
              <td>{app.job_title}</td>
              <td>
                <a
                  href={`http://localhost:5000/uploads/${app.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="view-resume"
                >
                  View Resume
                </a>
              </td>
              <td>{new Date(app.applied_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

    </div>
  );
};

export default Admin;
