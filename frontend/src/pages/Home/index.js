import "./index.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



   useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/candidate/blogs");
        const data = await res.json();

        if (res.ok) {
          setBlogs(data);
        } else {
          setError(data.message || "Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Something went wrong while fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);



  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">Mastersolis</span>
            <span className="logo-dot"></span>
          </div>
          <ul className="nav-links">
            <li><a href="#hero" className="nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#projects" className="nav-link">Projects</a></li>
            <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <Link to='/login' className="nav-link">Login</Link>
            <Link to='/register' className="nav-link">register</Link>
          </ul>
          <button className="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-background">
          <div className="particles"></div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-word">Mastersolis</span>
              <span className="title-word">Infotech</span>
            </h1>
            <p className="hero-tagline">Empowering Intelligence, Engineering the Future.</p>
            <div className="typing-text">
              <span id="typing-cursor">Building tomorrow's technology today</span>
            </div>
          </div>

          <div className="cta-buttons">
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}
            >
              Explore Services
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse"></div>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <h2 className="section-title">About Us</h2>
          <div className="section-subtitle">Who We Are</div>

          <div className="mvv-grid">
            <div className="mvv-card about-card">
              <div className="mvv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3>Our Mission</h3>
              <p>
                To innovate and deliver cutting-edge technology solutions that transform businesses
                and drive sustainable growth in the digital landscape.
              </p>
            </div>

            <div className="mvv-card about-card">
              <div className="mvv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21H3V3h9V1H3a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-9h-2v9z"></path>
                  <path d="M3 3h8v8H3z"></path>
                </svg>
              </div>
              <h3>Our Vision</h3>
              <p>
                To be a global leader in AI-powered technology solutions, fostering innovation and
                creating intelligent systems that shape the future.
              </p>
            </div>

            <div className="mvv-card about-card">
              <div className="mvv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
              <h3>Our Values</h3>
              <p>
                Innovation, integrity, excellence, and a customer-centric approach form the foundation
                of everything we do.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <h3 className="timeline-title">Our Journey</h3>
            <div className="timeline-container">
              {[
                { year: "2018", text: "Founded Mastersolis Infotech with a vision to innovate technology solutions" },
                { year: "2019", text: "Launched first AI-powered product, gaining recognition in the market" },
                { year: "2020", text: "Expanded to 50+ team members and served 100+ enterprise clients" },
                { year: "2023", text: "Pioneered breakthrough AI solutions with global clientele" },
                { year: "2025", text: "Established as industry leader in AI and intelligent systems" },
              ].map((item) => (
                <div className="timeline-item" key={item.year}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>{item.year}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <h3 className="team-title">Meet Our Team</h3>
            <div className="team-grid">
              {[
                { initials: "SA", name: "Sanjay Agarwal", role: "Founder & CEO", bio: "Visionary leader with 15+ years in tech innovation and AI solutions." },
                { initials: "RP", name: "Radhika Patel", role: "CTO", bio: "Tech innovator specializing in AI/ML architecture and cloud systems." },
                { initials: "AK", name: "Amit Kumar", role: "Head of Strategy", bio: "Strategic thinker driving business growth and market expansion." },
                { initials: "NS", name: "Neha Singh", role: "Lead Developer", bio: "Full-stack engineer passionate about building scalable systems." },
              ].map((member) => (
                <div className="team-card" key={member.initials}>
                  <div className="team-avatar">
                    <div className="avatar-placeholder">{member.initials}</div>
                  </div>
                  <h4>{member.name}</h4>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== Services Section ====== */}
<section id="services" className="services-section">
  <div className="container">
    <h2 className="section-title">Our Services</h2>

    <div className="services-container">
      {/* Service 1 */}
      <div className="service-card" aria-label="Web Development service card">
        <div className="service-inner">
          <div className="service-front">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ marginBottom: "12px" }}
            >
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>

            <h3>Web Development</h3>
            <p>
              Crafting responsive, performant web applications using modern frameworks and best
              practices.
            </p>
          </div>

          <div className="service-back" aria-hidden="true">
            <h4>What we do</h4>
            <p>
              Full-stack development (React / Next.js / Node.js), progressive web apps, performance
              optimization and accessible UX tailored for enterprises.
            </p>
          </div>
        </div>
      </div>

      {/* Service 2 */}
      <div className="service-card" aria-label="AI Solutions service card">
        <div className="service-inner">
          <div className="service-front">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ marginBottom: "12px" }}
            >
              <path
                d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>

            <h3>AI & Machine Learning</h3>
            <p>
              Custom AI models, predictive analytics and automation to turn data into actionable
              insights.
            </p>
          </div>

          <div className="service-back" aria-hidden="true">
            <h4>What we do</h4>
            <p>
              Model development, MLOps for production, explainability, and tailored ML pipelines to
              integrate AI across your stack.
            </p>
          </div>
        </div>
      </div>

      {/* Service 3 */}
      <div className="service-card" aria-label="Cloud Integration service card">
        <div className="service-inner">
          <div className="service-front">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ marginBottom: "12px" }}
            >
              <path
                d="M20 17.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            <h3>Cloud Solutions</h3>
            <p>
              Secure, scalable cloud architecture, migrations and cost optimization for enterprise
              workloads.
            </p>
          </div>

          <div className="service-back" aria-hidden="true">
            <h4>What we do</h4>
            <p>
              Cloud strategy, migration, infra-as-code, containerization, and observability to run
              reliable systems at scale.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ====== Projects Section ====== */}
<section id="projects" className="projects-section">
  <div className="container">
    <h2 className="section-title">Selected Projects</h2>
    <div className="section-subtitle">Real work we shipped with partners</div>

    <div className="projects-grid">
      {[
        {
          title: "CommercePulse",
          company: "E-Commerce Innovations",
          desc: "Headless commerce platform with realtime recommendations and 99.99% uptime for peak seasons.",
          tech: ["React", "Node.js", "Postgres"],
        },
        {
          title: "FinSight",
          company: "FinanceHub India",
          desc: "Predictive analytics dashboard for lending risk that reduced defaults by 18% in pilot.",
          tech: ["Python", "ML", "AWS"],
        },
        {
          title: "RetailSense",
          company: "RetailMax",
          desc: "Omnichannel analytics & inventory system for 200+ stores with micro-fulfillment routing.",
          tech: ["Go", "Kafka", "Kubernetes"],
        },
        {
          title: "GreenGrid Monitor",
          company: "GreenGrid Energy",
          desc: "IoT platform to monitor distributed solar farms and optimize energy export in real time.",
          tech: ["Rust", "MQTT", "Timeseries"],
        },
        {
          title: "MediFlow",
          company: "MediSys Health",
          desc: "Secure patient-data workflow and scheduling platform used by clinics across the region.",
          tech: ["Django", "Postgres", "HIPAA"],
        },
        {
          title: "LogiRoute",
          company: "TechCorp Solutions",
          desc: "Route-optimization engine for last-mile delivery reducing fuel by 12% during trials.",
          tech: ["C++", "Graph", "Redis"],
        },
      ].map((project, index) => (
        <article className="project-card" key={index}>
          <div className="project-card-inner">
            <div className="project-media" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-company">{project.company}</div>
              <p className="project-desc">{project.desc}</p>

              <div className="project-meta">
                {project.tech.map((tech) => (
                  <span className="tech" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-actions">
                <a href="#" className="btn btn-outline">
                  Case Study
                </a>
                <a href="#" className="btn btn-primary">
                  Live
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<section id="blogpost" className="blog-post">
  <h2 className="section-title">Latest Blog Posts</h2>

  {loading ? (
    <p className="loading">Loading blogs...</p>
  ) : error ? (
    <p className="error">{error}</p>
  ) : blogs.length === 0 ? (
    <p>No blog posts available yet.</p>
  ) : (
    <div className="blog-scroll-container">
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card glass-card">
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="blog-image"
              />
            )}
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p className="blog-summary">{blog.summary}</p>
              <p className="blog-meta">
                🏷 {blog.category} • 📅{" "}
                {new Date(blog.publish_date).toLocaleDateString()}
              </p>
              <a
                href="#"
                className="read-more-btn"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Full blog coming soon!");
                }}
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</section>


{/* ====== Testimonials Section ====== */}
<section id="testimonials" className="testimonials">
  <div className="testimonials-container">
    <h2 className="section-title">What Our Clients Say</h2>
    <div className="section-subtitle">Real Success Stories</div>

    <div className="testimonials-carousel">
      {[
        {
          text: `"Mastersolis transformed our entire data infrastructure. Their AI solutions have increased our efficiency by 40% and we couldn't be happier with the results."`,
          name: "Arun Reddy",
          company: "TechCorp Solutions",
          initials: "AR",
        },
        {
          text: `"The cloud migration project was seamless and well-executed. Mastersolis team's expertise and support made the transition smooth and risk-free."`,
          name: "Priya Sharma",
          company: "FinanceHub India",
          initials: "PS",
        },
        {
          text: `"Outstanding cybersecurity implementation. Mastersolis identified vulnerabilities we didn't know existed and secured our systems comprehensively."`,
          name: "Vikram Kapoor",
          company: "RetailMax",
          initials: "VK",
        },
        {
          text: `"The custom web application built by Mastersolis exceeded expectations. User interface is intuitive and performance is exceptional."`,
          name: "Maya Bhat",
          company: "E-Commerce Innovations",
          initials: "MB",
        },
      ].map((testimonial, i) => (
        <div className={`testimonial-card ${i === 0 ? "active" : ""}`} key={i}>
          <div className="testimonial-content">
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.initials}</div>
              <div className="author-info">
                <p className="author-name">{testimonial.name}</p>
                <p className="author-company">{testimonial.company}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="carousel-controls">
      <button className="carousel-btn prev" id="prev-testimonial"></button>
      <div className="carousel-indicators">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`indicator ${i === 0 ? "active" : ""}`}
            data-index={i}
          ></span>
        ))}
      </div>
      <button className="carousel-btn next" id="next-testimonial"></button>
    </div>
  </div>
</section>


      <section id="contact" className="contact">
  <div className="contact-container">
    <h2 className="section-title">Get In Touch</h2>
    <div className="section-subtitle">Let's Create Something Amazing Together</div>

    <div className="contact-content">
      {/* Contact Info */}
      <div className="contact-info">
        {/* Location */}
        <div className="info-card">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
          <h4>Location</h4>
          <p>Bengaluru, India</p>
        </div>

        {/* Email */}
        <div className="info-card">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M4 6l8 6 8-6"></path>
            </svg>
          </div>
          <h4>Email</h4>
          <p>
            <a href="mailto:info@mastersolis.com">info@mastersolis.com</a>
          </p>
        </div>

        {/* Phone */}
        <div className="info-card">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h4>Phone</h4>
          <p>
            <a href="tel:+919876543210">+91-98765-43210</a>
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <form className="contact-form" id="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <input type="text" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Subject" />
        </div>
        <div className="form-group">
          <textarea placeholder="Your Message" rows="5" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            &copy; 2025 Mastersolis Infotech. All rights reserved. | Empowering Intelligence,
            Engineering the Future.
          </p>
          <div className="footer-links">
            <a href="#hero">Privacy Policy</a>
            <a href="#hero">Terms of Service</a>
            <a href="#hero">Social Media</a>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <div className="chatbot-widget">
        <div className="chatbot-icon" id="chatbot-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className="chatbot-popup" id="chatbot-popup">
          <div className="chatbot-header">
            <h4>Mastersolis AI Assistant</h4>
            <button className="close-chat" id="close-chat">×</button>
          </div>
          <div className="chatbot-messages" id="chatbot-messages">
            <div className="message bot-message">
              <p>Hello! 👋 How can I help you today?</p>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Type your message..." />
            <button id="send-message">Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
