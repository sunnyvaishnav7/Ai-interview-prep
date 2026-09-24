import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import AppNav from '../../../components/AppNav'
import { 
    Code, 
    MessageSquare, 
    CalendarRange, 
    Download, 
    ChevronDown, 
    Copy, 
    Check, 
    Lightbulb, 
    Award, 
    AlertTriangle, 
    CheckCircle2, 
    Sparkles,
    TrendingUp
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <Code size={18} strokeWidth={1.5} /> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { id: 'roadmap', label: 'Preparation Roadmap', icon: <CalendarRange size={18} strokeWidth={1.5} /> },
]

// ── Question Accordion Sub-Component ───────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(index === 0) // open first question by default
    const [copied, setCopied] = useState(false)

    const handleCopyAnswer = (e) => {
        e.stopPropagation()
        if (item.answer) {
            navigator.clipboard.writeText(item.answer)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        }
    }

    // Determine difficulty tag (fallback to MEDIUM if not specified)
    const difficulty = (item.difficulty || (index % 3 === 0 ? 'HARD' : index % 2 === 0 ? 'MEDIUM' : 'EASY')).toUpperCase()
    const diffClass = difficulty === 'HARD' ? 'diff-tag--hard' : difficulty === 'EASY' ? 'diff-tag--easy' : 'diff-tag--medium'

    return (
        <div className={`q-card ${open ? 'q-card--expanded' : ''}`}>
            <div className="q-card__header" onClick={() => setOpen(prev => !prev)}>
                <div className="header-main">
                    <span className="q-index">Q{index + 1}</span>
                    <h3 className="q-title">{item.question}</h3>
                </div>
                <div className="header-right">
                    <span className={`diff-tag ${diffClass}`}>{difficulty}</span>
                    <ChevronDown size={18} className={`chevron-icon ${open ? 'chevron-icon--rotated' : ''}`} />
                </div>
            </div>

            {open && (
                <div className="q-card__body">
                    {/* Interviewer Intention Sub-Section */}
                    {item.intention && (
                        <div className="q-section q-section--intention">
                            <div className="q-section__header">
                                <span className="section-label intention-label">
                                    <Lightbulb size={15} />
                                    Why Interviewers Ask This
                                </span>
                            </div>
                            <p className="section-text">{item.intention}</p>
                        </div>
                    )}

                    {/* Model Answer Sub-Section */}
                    <div className="q-section q-section--answer">
                        <div className="q-section__header">
                            <span className="section-label answer-label">
                                <Award size={15} />
                                High-Scoring Model Answer
                            </span>
                            <button
                                type="button"
                                className={`copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopyAnswer}
                                title="Copy answer to clipboard"
                            >
                                {copied ? (
                                    <>
                                        <Check size={13} strokeWidth={2.5} />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={13} />
                                        <span>Copy Answer</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="section-text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Interactive Roadmap Day Sub-Component ─────────────────────────────────────
const RoadMapDay = ({ day }) => {
    const [completedTasks, setCompletedTasks] = useState({})

    const toggleTask = (taskIndex) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskIndex]: !prev[taskIndex]
        }))
    }

    const taskCount = day.tasks?.length || 0
    const completedCount = Object.values(completedTasks).filter(Boolean).length

    return (
        <div className="roadmap-card">
            <div className="roadmap-card__header">
                <div className="header-left">
                    <span className="day-badge">Day {day.day}</span>
                    <h3>{day.focus}</h3>
                </div>
                <span className="task-progress">
                    {completedCount} of {taskCount} tasks done
                </span>
            </div>

            <ul className="task-list">
                {day.tasks?.map((task, i) => {
                    const isDone = !!completedTasks[i]
                    return (
                        <li key={i} className="task-item" onClick={() => toggleTask(i)}>
                            <div className={`task-checkbox ${isDone ? 'task-checkbox--checked' : ''}`}>
                                {isDone && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className={`task-text ${isDone ? 'task-text--completed' : ''}`}>
                                {task}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── Radial Match Score Ring Sub-Component ─────────────────────────────────────
const RadialScoreWidget = ({ score }) => {
    const [animatedScore, setAnimatedScore] = useState(0)

    useEffect(() => {
        const duration = 1000
        const steps = 30
        const increment = score / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= score) {
                setAnimatedScore(score)
                clearInterval(timer)
            } else {
                setAnimatedScore(Math.round(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [score])

    // Progress math
    const radius = 62
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference

    // Color gradient tokens per §2.4
    let gradientStart = "#EF4444"
    let gradientEnd = "#F97316"
    let feedback = "Needs Work Before Interview"
    let feedbackSub = "Focus on critical skill gaps below"

    if (score >= 75) {
        gradientStart = "#FF7A1A"
        gradientEnd = "#22C55E"
        feedback = "Interview Ready"
        feedbackSub = "Strong profile match for this position"
    } else if (score >= 50) {
        gradientStart = "#F59E0B"
        gradientEnd = "#FF9A44"
        feedback = "On Track with Preparation"
        feedbackSub = "Review the recommended roadmap"
    }

    return (
        <div className="score-widget-card">
            <h4 className="score-widget-card__title">Candidate Match Score</h4>
            
            <div className="radial-container">
                <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={gradientStart} />
                            <stop offset="100%" stopColor={gradientEnd} />
                        </linearGradient>
                    </defs>
                    <circle
                        className="circle-bg"
                        cx="80"
                        cy="80"
                        r={radius}
                    />
                    <circle
                        className="circle-progress"
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="url(#scoreGrad)"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>

                <div className="radial-center-text">
                    <span className="score-number">{animatedScore}</span>
                    <span className="score-symbol">% MATCH</span>
                </div>
            </div>

            <p className="score-feedback">{feedback}</p>
            <p className="score-subtext">{feedbackSub}</p>
        </div>
    )
}

// ── Main Interview Hub Component ──────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [downloadingResume, setDownloadingResume] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleDownloadResume = async () => {
        try {
            setDownloadingResume(true)
            await getResumePdf(interviewId)
        } catch (e) {
            console.error("Failed to download resume pdf", e)
        } finally {
            setDownloadingResume(false)
        }
    }

    if (loading || !report) {
        return (
            <main className="loading-screen">
                <div className="spinner-ring" />
                <h1>Loading your interview plan...</h1>
                <p>Generating custom response cards &amp; match analytics</p>
            </main>
        )
    }

    // Group skill gaps
    const skillGaps = report.skillGaps || []
    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || []
    const preparationPlan = report.preparationPlan || []
    const matchScore = report.matchScore || 70

    return (
        <div className="interview-page">
            <AppNav />

            <div className="interview-layout">
                
                {/* ── Left Sidebar Nav ── */}
                <aside className="interview-nav">
                    <div>
                        <p className="nav-header-label">Preparation Hub</p>
                        <nav className="nav-tabs">
                            {NAV_ITEMS.map(item => {
                                const count = 
                                    item.id === 'technical' ? technicalQuestions.length :
                                    item.id === 'behavioral' ? behavioralQuestions.length :
                                    preparationPlan.length

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`nav-tab-btn ${activeNav === item.id ? 'nav-tab-btn--active' : ''}`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <div className="tab-left">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        <span className="tab-count">{count}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="nav-footer-action">
                        <button
                            type="button"
                            onClick={handleDownloadResume}
                            disabled={downloadingResume}
                            className="resume-download-btn"
                        >
                            <Download size={16} className="download-icon" />
                            <span>{downloadingResume ? "Generating PDF..." : "Download Tailored Resume"}</span>
                        </button>
                    </div>
                </aside>

                {/* ── Center Workspace ── */}
                <main className="interview-content">
                    {/* Technical Questions Tab */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className="workspace-header">
                                <div className="header-left">
                                    <h2>Technical Drill &amp; System Concepts</h2>
                                    <p>Role-aligned coding patterns, architecture, and core concept questions</p>
                                </div>
                                <span className="header-badge">{technicalQuestions.length} Questions</span>
                            </div>
                            <div className="q-list" style={{ marginTop: '1.25rem' }}>
                                {technicalQuestions.map((q, idx) => (
                                    <QuestionCard key={idx} item={q} index={idx} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Behavioral Questions Tab */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className="workspace-header">
                                <div className="header-left">
                                    <h2>Behavioral &amp; Leadership Scenarios</h2>
                                    <p>STAR-method framed questions addressing culture, communication, and ownership</p>
                                </div>
                                <span className="header-badge">{behavioralQuestions.length} Questions</span>
                            </div>
                            <div className="q-list" style={{ marginTop: '1.25rem' }}>
                                {behavioralQuestions.map((q, idx) => (
                                    <QuestionCard key={idx} item={q} index={idx} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Preparation Roadmap Tab */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className="workspace-header">
                                <div className="header-left">
                                    <h2>Personalized Day-by-Day Roadmap</h2>
                                    <p>High-yield study priorities structured to prepare you systematically</p>
                                </div>
                                <span className="header-badge">{preparationPlan.length}-Day Plan</span>
                            </div>
                            <div className="roadmap-grid" style={{ marginTop: '1.25rem' }}>
                                {preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar Rail ── */}
                <aside className="interview-sidebar">
                    
                    {/* Animated Radial Match Score */}
                    <RadialScoreWidget score={matchScore} />

                    {/* Skill Gaps Cloud */}
                    {skillGaps.length > 0 && (
                        <div className="skill-gaps-card">
                            <div className="skill-gaps-card__header">
                                <h3>
                                    <TrendingUp size={16} color="var(--orange-400)" />
                                    <span>Skill Gap Analysis</span>
                                </h3>
                                <span className="gap-count">{skillGaps.length} Gaps</span>
                            </div>
                            <div className="gap-cloud">
                                {skillGaps.map((gap, i) => {
                                    const severity = (gap.severity || 'moderate').toLowerCase()
                                    const pillClass = 
                                        severity === 'critical' ? 'skill-pill--critical' :
                                        severity === 'minor' ? 'skill-pill--minor' : 'skill-pill--moderate'

                                    return (
                                        <div
                                            key={i}
                                            className={`skill-pill ${pillClass}`}
                                            title={gap.recommendation || `${gap.skill} (${severity})`}
                                        >
                                            <span className="severity-dot" />
                                            <span>{gap.skill}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Mobile / Tablet Sticky Bottom Download Bar */}
            <div className="mobile-sticky-resume">
                <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloadingResume}
                    className="btn btn-primary"
                    style={{ width: '100%', height: '44px' }}
                >
                    <Download size={16} />
                    <span>{downloadingResume ? "Generating PDF..." : "Download Tailored Resume"}</span>
                </button>
            </div>
        </div>
    )
}

export default Interview