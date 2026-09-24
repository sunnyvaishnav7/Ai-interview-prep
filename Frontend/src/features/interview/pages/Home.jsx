import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import AppNav from '../../../components/AppNav'
import { 
    Sparkles, 
    Briefcase, 
    User, 
    UploadCloud, 
    FileText, 
    Check, 
    X, 
    AlertCircle, 
    ArrowRight, 
    Calendar, 
    Target, 
    Layers, 
    Zap,
    ShieldCheck
} from 'lucide-react'

const SAMPLE_JDS = [
    {
        label: "Senior Frontend (React/TS)",
        text: `Role: Senior Frontend Engineer
Company: CloudScale AI
Requirements:
- 5+ years building high-performance SPAs with React, TypeScript, and modern state management.
- Deep expertise in web performance optimization, virtual DOM internals, and browser rendering lifecycles.
- Proven experience with System Design for frontend applications, micro-frontends, and WebSocket real-time architectures.
- Strong knowledge of accessibility (WCAG 2.1 AA), modern CSS (Glassmorphism, animations), and CI/CD pipelines.`
    },
    {
        label: "Full Stack AI Engineer",
        text: `Role: Full Stack AI Engineer
Company: HyperScale Labs
Requirements:
- Strong proficiency in Node.js/Express, Python (FastAPI), React, and PostgreSQL/MongoDB.
- Experience integrating LLM APIs (OpenAI, Gemini, Anthropic), vector databases (Pinecone, ChromaDB), and RAG pipelines.
- Deep understanding of prompt engineering, model fine-tuning considerations, latency reduction, and token optimization.
- Ability to architect end-to-end scalable microservices deployed on Docker/Kubernetes and AWS.`
    },
    {
        label: "Backend Distributed Systems",
        text: `Role: Senior Backend Engineer
Company: FinTech Core
Requirements:
- 6+ years designing high-throughput distributed systems in Go or Java/Node.js.
- Strong fundamentals in concurrency, distributed locking, Kafka event-driven architectures, and ACID compliance.
- Experience with database sharding, indexing, read/write replicas, and caching strategies with Redis.
- Knowledge of containerization, gRPC APIs, and Zero-Downtime deployment strategies.`
    }
]

const PROGRESS_STEPS = [
    { text: "Parsing target job requirements...", progress: 20 },
    { text: "Analyzing resume skills & career trajectory...", progress: 45 },
    { text: "Evaluating skill gaps & match score...", progress: 70 },
    { text: "Synthesizing custom questions & day-by-day roadmap...", progress: 92 },
]

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [validationError, setValidationError] = useState("")
    
    const resumeInputRef = useRef(null)
    const navigate = useNavigate()

    const maxChars = 6000
    const charCount = jobDescription.length
    const isNearLimit = charCount > maxChars * 0.8 && charCount <= maxChars
    const isLimitExceeded = charCount > maxChars

    // Progress stepper animation during generation
    useEffect(() => {
        let interval
        if (isGenerating) {
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev))
            }, 5500)
        } else {
            setCurrentStepIndex(0)
        }
        return () => clearInterval(interval)
    }, [isGenerating])

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setValidationError("")
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            setSelectedFile(file)
            setValidationError("")
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleRemoveFile = (e) => {
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleSampleClick = (sampleText) => {
        setJobDescription(sampleText)
        setValidationError("")
    }

    const handleGenerateReport = async () => {
        setValidationError("")

        if (!jobDescription.trim()) {
            setValidationError("Please paste a target Job Description to analyze.")
            return
        }

        if (!selectedFile && !selfDescription.trim()) {
            setValidationError("Please provide either a Resume file (PDF/DOCX) or a Quick Self-Description.")
            return
        }

        try {
            setIsGenerating(true)
            const resumeFile = selectedFile || resumeInputRef.current?.files?.[0]
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            setValidationError(err.response?.data?.message || err.message || "Failed to generate strategy. Please verify backend connection.")
        } finally {
            setIsGenerating(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB"
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const getScoreBadgeClass = (score) => {
        if (score >= 75) return 'score-badge--high'
        if (score >= 50) return 'score-badge--mid'
        return 'score-badge--low'
    }

    return (
        <div className="home-page">
            <AppNav />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">
                    <Sparkles size={14} className="spark-icon" />
                    <span>Next-Gen AI Preparation Engine</span>
                </div>
                <h1>Your Next Interview, <span className="hero-glow">Engineered.</span></h1>
                <p>
                    Transform any job description and resume into a high-impact preparation hub with custom technical drills, behavioral answers, and daily roadmaps.
                </p>
                <div className="trust-chips">
                    <div className="trust-chip">
                        <Zap size={14} />
                        <span>~30s Fast Synthesis</span>
                    </div>
                    <div className="trust-chip">
                        <Target size={14} />
                        <span>Precision Match Scoring</span>
                    </div>
                    <div className="trust-chip">
                        <Layers size={14} />
                        <span>Adaptive Day Roadmaps</span>
                    </div>
                    <div className="trust-chip">
                        <ShieldCheck size={14} />
                        <span>ATS Tailored Resumes</span>
                    </div>
                </div>
            </section>

            {/* Main Strategy Builder Card */}
            <div className="strategy-builder-card">
                <div className="strategy-builder-card__body">
                    
                    {/* Left Panel - Target Job Description */}
                    <div className="panel panel--left">
                        <div className="panel__header">
                            <div className="title-group">
                                <div className="icon-box">
                                    <Briefcase size={17} strokeWidth={2} />
                                </div>
                                <h2>Target Job Description</h2>
                            </div>
                            <span className="badge-required">Required</span>
                        </div>

                        {/* Quick Sample Presets */}
                        <div className="quick-templates">
                            <span className="template-label">Quick test:</span>
                            {SAMPLE_JDS.map((sample, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSampleClick(sample.text)}
                                    className="template-chip"
                                >
                                    {sample.label}
                                </button>
                            ))}
                        </div>

                        <div className="textarea-wrapper">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => { setJobDescription(e.target.value); setValidationError(""); }}
                                className="panel-textarea"
                                placeholder="Paste the complete job description, requirements, and responsibilities here..."
                                maxLength={maxChars}
                            />
                            <div className={`char-counter ${isNearLimit ? 'near-limit' : ''} ${isLimitExceeded ? 'limit-exceeded' : ''}`}>
                                {charCount.toLocaleString()} / {maxChars.toLocaleString()} chars
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="vertical-divider" />

                    {/* Right Panel - Profile */}
                    <div className="panel panel--right">
                        <div className="panel__header">
                            <div className="title-group">
                                <div className="icon-box">
                                    <User size={17} strokeWidth={2} />
                                </div>
                                <h2>Your Profile</h2>
                            </div>
                            <span className="badge-recommended">Best Results</span>
                        </div>

                        {/* Dropzone / Uploaded File Chip */}
                        <div className="dropzone-container">
                            {!selectedFile ? (
                                <div
                                    className={`dropzone ${isDragging ? 'dropzone--dragover' : ''}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => resumeInputRef.current?.click()}
                                >
                                    <UploadCloud size={32} strokeWidth={1.5} className="dropzone-icon" />
                                    <p className="dropzone-title">Click to upload or drag &amp; drop resume</p>
                                    <p className="dropzone-sub">Supports PDF or DOCX (Max 10MB)</p>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        hidden
                                        id="resume"
                                        name="resume"
                                        accept=".pdf,.docx"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="file-chip">
                                    <div className="file-info">
                                        <FileText size={22} className="file-icon" />
                                        <div>
                                            <p className="file-name">{selectedFile.name}</p>
                                            <span className="file-size">{formatFileSize(selectedFile.size)} &bull; Ready</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={handleRemoveFile}
                                        title="Remove file"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className="or-divider">
                            <span>OR</span>
                        </div>

                        {/* Quick Self-Description */}
                        <div className="textarea-wrapper">
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value); setValidationError(""); }}
                                className="panel-textarea panel-textarea--short"
                                placeholder="Briefly describe your experience, primary tech stack, years of experience, or notable achievements if you don't have a resume file handy..."
                            />
                        </div>

                        {/* Info Tip */}
                        <div className="info-tip">
                            <AlertCircle size={16} />
                            <span>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized strategy.</span>
                        </div>
                    </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                    <div style={{
                        margin: '0 2.25rem 1rem 2.25rem',
                        padding: '12px 16px',
                        background: 'var(--color-danger-bg)',
                        border: '1px solid var(--color-danger-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-danger)',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <AlertCircle size={18} />
                        <span>{validationError}</span>
                    </div>
                )}

                {/* Card Footer CTA */}
                <div className="strategy-builder-card__footer">
                    {isGenerating ? (
                        <div className="cta-status-morph">
                            <div className="morph-header">
                                <span className="status-text">
                                    <Sparkles size={18} className="spark-icon" style={{ animation: 'spin 2s linear infinite' }} />
                                    {PROGRESS_STEPS[currentStepIndex].text}
                                </span>
                                <span className="eta-pill">~30s</span>
                            </div>
                            <div className="morph-progress-bar">
                                <div
                                    className="morph-fill"
                                    style={{ width: `${PROGRESS_STEPS[currentStepIndex].progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="btn btn-cta"
                            >
                                <Sparkles size={18} strokeWidth={2.2} />
                                <span>Generate My Interview Strategy</span>
                            </button>
                            <div className="footer-eta">
                                <span>AI-Powered Strategy Generation &bull; Approx 30s</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Reports Section */}
            {reports && reports.length > 0 && (
                <section id="recent-reports" className="recent-reports-section">
                    <div className="recent-reports-section__header">
                        <h2>Recent Interview Plans</h2>
                        <span className="report-count-badge">{reports.length} {reports.length === 1 ? 'Report' : 'Reports'} Available</span>
                    </div>

                    <div className="reports-grid">
                        {reports.map((rpt) => (
                            <div
                                key={rpt._id}
                                className="report-card"
                                onClick={() => navigate(`/interview/${rpt._id}`)}
                            >
                                <div className="report-card__top">
                                    <h3 className="report-title">{rpt.title || 'Untitled Target Position'}</h3>
                                    <span className={`score-badge ${getScoreBadgeClass(rpt.matchScore || 0)}`}>
                                        {rpt.matchScore || 0}% Match
                                    </span>
                                </div>
                                <div className="report-card__bottom">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Calendar size={13} />
                                        {new Date(rpt.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="open-link">
                                        Open Plan <ArrowRight size={14} className="open-arrow" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Page Footer */}
            <footer className="home-footer">
                <div>&copy; {new Date().getFullYear()} AI Interview Copilot. Precision engineered.</div>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">API Documentation</a>
                    <a href="#">Support</a>
                </div>
            </footer>
        </div>
    )
}

export default Home