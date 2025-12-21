import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Animated Counter Component
 * Shows growth metrics counting up through data points over time
 */
function AnimatedCounter({ project }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const countRef = useRef(null);
    const [displayValue, setDisplayValue] = useState(0);

    const hasChartData = project.metrics.data && Array.isArray(project.metrics.data);
    const data = hasChartData ? project.metrics.data : [];
    const labels = project.metrics.labels || [];
    const max = hasChartData ? Math.max(...data) : 1;

    // For speed/comparison types
    const isBefore = project.metrics.type === 'speed' || project.metrics.type === 'comparison';
    const beforeValue = project.metrics.before || 0;
    const afterValue = project.metrics.after || 0;

    useEffect(() => {
        if (!hasChartData && !isBefore) return;

        if (hasChartData) {
            // Animate through each data point
            let index = 0;
            setCurrentIndex(0);
            setDisplayValue(data[0]);
            setIsAnimating(true);

            const interval = setInterval(() => {
                if (index < data.length - 1) {
                    index++;
                    setCurrentIndex(index);

                    // Animate the value counting up
                    const startValue = data[index - 1];
                    const endValue = data[index];
                    const duration = 400;
                    const startTime = Date.now();

                    const animateValue = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                        const currentValue = Math.round(startValue + (endValue - startValue) * eased);
                        setDisplayValue(currentValue);

                        if (progress < 1) {
                            requestAnimationFrame(animateValue);
                        }
                    };
                    requestAnimationFrame(animateValue);
                } else {
                    setIsAnimating(false);
                    clearInterval(interval);
                }
            }, 800);

            return () => clearInterval(interval);
        } else if (isBefore) {
            // Animate from before to after value
            setDisplayValue(beforeValue);
            setIsAnimating(true);

            const timeout = setTimeout(() => {
                const duration = 1500;
                const startTime = Date.now();

                const animateValue = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);

                    if (project.metrics.type === 'speed') {
                        const currentValue = beforeValue - (beforeValue - afterValue) * eased;
                        setDisplayValue(parseFloat(currentValue.toFixed(1)));
                    } else {
                        const currentValue = beforeValue + (afterValue - beforeValue) * eased;
                        setDisplayValue(Math.round(currentValue));
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animateValue);
                    } else {
                        setIsAnimating(false);
                    }
                };
                requestAnimationFrame(animateValue);
            }, 600);

            return () => clearTimeout(timeout);
        }
    }, [project]);

    const getGrowthPercentage = () => {
        if (hasChartData && data.length > 1) {
            const growth = ((data[currentIndex] - data[0]) / data[0] * 100).toFixed(0);
            return growth > 0 ? `+${growth}%` : `${growth}%`;
        }
        if (isBefore) {
            if (project.metrics.type === 'speed') {
                const improvement = ((beforeValue - afterValue) / beforeValue * 100).toFixed(0);
                return `${improvement}% faster`;
            } else {
                const growth = ((afterValue - beforeValue) / beforeValue * 100).toFixed(0);
                return `+${growth}%`;
            }
        }
        return '';
    };

    return (
        <div style={{
            background: 'var(--dark-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '280px'
        }}>
            {/* Header */}
            <div style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                {isAnimating && (
                    <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ color: 'var(--accent-green)' }}
                    >●</motion.span>
                )}
                {hasChartData ? 'Growth Over Time' : project.metrics.type === 'speed' ? 'Speed Optimization' : 'Performance Growth'}
            </div>

            {/* Main Counter Display */}
            <div style={{
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                <motion.div
                    key={displayValue}
                    initial={{ scale: 1.1, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        fontSize: '56px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--primary), var(--accent-green))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.1
                    }}
                >
                    {displayValue.toLocaleString()}{project.metrics.type === 'speed' ? 's' : ''}
                </motion.div>

                {hasChartData && labels[currentIndex] && (
                    <motion.div
                        key={currentIndex}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            marginTop: '4px'
                        }}
                    >
                        {labels[currentIndex]}
                    </motion.div>
                )}
            </div>

            {/* Progress Timeline */}
            {hasChartData && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }}>
                        {labels.map((label, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    fontSize: '9px',
                                    color: i <= currentIndex ? 'var(--primary)' : 'var(--text-tertiary)',
                                    fontWeight: i === currentIndex ? 600 : 400
                                }}
                            >
                                {label}
                            </motion.div>
                        ))}
                    </div>

                    <div style={{
                        height: '6px',
                        background: 'var(--dark-bg)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--accent-green))',
                                borderRadius: '3px'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Before/After for speed/comparison types */}
            {isBefore && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '32px',
                    marginBottom: '16px'
                }}>
                    <div style={{ textAlign: 'center', opacity: 0.6 }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Started at</div>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: '#ff6b6b' }}>
                            {beforeValue}{project.metrics.type === 'speed' ? 's' : ''}
                        </div>
                    </div>
                    <div style={{ fontSize: '24px', color: 'var(--primary)', alignSelf: 'center' }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Now</div>
                        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent-green)' }}>
                            {afterValue}{project.metrics.type === 'speed' ? 's' : ''}
                        </div>
                    </div>
                </div>
            )}

            {/* Mini Sparkline */}
            {hasChartData && (
                <div style={{ height: '40px', marginBottom: '16px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="counterGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Filled area */}
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: (currentIndex + 1) / data.length }}
                            transition={{ duration: 0.4 }}
                            d={`M0,40 ${data.slice(0, currentIndex + 1).map((v, i) => {
                                const x = (i / (data.length - 1)) * 200;
                                const y = 40 - (v / max) * 35;
                                return `L${x},${y}`;
                            }).join(' ')} L${(currentIndex / (data.length - 1)) * 200},40 Z`}
                            fill="url(#counterGrad)"
                        />

                        {/* Line */}
                        <motion.path
                            d={`M${data.map((v, i) => {
                                const x = (i / (data.length - 1)) * 200;
                                const y = 40 - (v / max) * 35;
                                return `${x},${y}`;
                            }).join(' L')}`}
                            fill="none"
                            stroke="var(--border-subtle)"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />

                        {/* Animated line */}
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: (currentIndex + 1) / data.length }}
                            transition={{ duration: 0.4 }}
                            d={`M${data.slice(0, currentIndex + 1).map((v, i) => {
                                const x = (i / (data.length - 1)) * 200;
                                const y = 40 - (v / max) * 35;
                                return `${x},${y}`;
                            }).join(' L')}`}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                        />

                        {/* Current point */}
                        <motion.circle
                            cx={(currentIndex / (data.length - 1)) * 200}
                            cy={40 - (data[currentIndex] / max) * 35}
                            r="4"
                            fill="var(--primary)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        />
                    </svg>
                </div>
            )}

            {/* Growth Badge */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-green))',
                    color: 'var(--dark-bg)',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600
                }}
            >
                {!isAnimating ? getGrowthPercentage() + ' growth' : 'Tracking progress...'}
            </motion.div>
        </div>
    );
}

/**
 * Interactive Case Study Charts Component
 * Click on cards to see full details with challenge/solution/results and visualization
 */

export default function CaseStudyCharts({ caseStudies }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState({ projectId: null, pointIndex: null });

    return (
        <div className="case-study-charts">
            <div className="charts-header">
                <h2>Our Work</h2>
                <p>Click on any project to see the full case study</p>
            </div>

            <div className="charts-grid">
                {caseStudies.map((project, i) => (
                    <CaseStudyCard
                        key={i}
                        project={project}
                        projectIndex={i}
                        isSelected={selectedProject === i}
                        hoveredPoint={hoveredPoint}
                        onHover={(pointIndex) => setHoveredPoint({ projectId: i, pointIndex })}
                        onHoverEnd={() => setHoveredPoint({ projectId: null, pointIndex: null })}
                        onClick={() => setSelectedProject(selectedProject === i ? null : i)}
                    />
                ))}
            </div>

            {/* Full Details Panel */}
            <AnimatePresence>
                {selectedProject !== null && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="project-details-panel"
                    >
                        <ProjectDetailsPanel
                            project={caseStudies[selectedProject]}
                            onClose={() => setSelectedProject(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .case-study-charts {
          margin-bottom: 40px;
        }

        .charts-header {
          margin-bottom: 28px;
        }

        .charts-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .charts-header p {
          color: var(--text-tertiary);
          font-size: 14px;
          margin: 0;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .project-details-panel {
          margin-top: 28px;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}

function CaseStudyCard({ project, projectIndex, isSelected, hoveredPoint, onHover, onHoverEnd, onClick }) {
    const hasChartData = project.metrics.data && Array.isArray(project.metrics.data);
    const chartData = hasChartData ? project.metrics.data : [];
    const max = hasChartData ? Math.max(...chartData) : 1;

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -4 }}
            style={{
                background: 'var(--dark-card)',
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>{project.icon}</span>
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px' }}>{project.client}</div>
                    <span style={{
                        fontSize: '10px',
                        background: 'var(--dark-surface)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>{project.industry}</span>
                </div>
            </div>

            {/* Interactive Chart */}
            {hasChartData ? (
                <div style={{ height: '80px', marginBottom: '16px', position: 'relative' }}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 200 80"
                        preserveAspectRatio="none"
                        onMouseLeave={onHoverEnd}
                    >
                        <defs>
                            <linearGradient id={`grad-${projectIndex}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <path
                            d={`M0,80 ${chartData.map((v, i) => {
                                const x = (i / (chartData.length - 1)) * 200;
                                const y = 80 - (v / max) * 70;
                                return `L${x},${y}`;
                            }).join(' ')} L200,80 Z`}
                            fill={`url(#grad-${projectIndex})`}
                        />

                        <path
                            d={`M${chartData.map((v, i) => {
                                const x = (i / (chartData.length - 1)) * 200;
                                const y = 80 - (v / max) * 70;
                                return `${i === 0 ? '' : ' '}${x},${y}`;
                            }).join('')}`}
                            fill="none"
                            stroke="var(--accent-green)"
                            strokeWidth="2.5"
                        />

                        {chartData.map((v, i) => {
                            const x = (i / (chartData.length - 1)) * 200;
                            const y = 80 - (v / max) * 70;
                            const isHovered = hoveredPoint.projectId === projectIndex && hoveredPoint.pointIndex === i;

                            return (
                                <g key={i}>
                                    <circle cx={x} cy={y} r={15} fill="transparent" onMouseEnter={() => onHover(i)} />
                                    <circle
                                        cx={x} cy={y} r={isHovered ? 5 : 3}
                                        fill={isHovered ? 'var(--accent-green)' : 'var(--dark-card)'}
                                        stroke="var(--accent-green)"
                                        strokeWidth="2"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {hoveredPoint.projectId === projectIndex && hoveredPoint.pointIndex !== null && (
                        <div style={{
                            position: 'absolute',
                            left: `${(hoveredPoint.pointIndex / (chartData.length - 1)) * 100}%`,
                            top: '0',
                            transform: 'translateX(-50%)',
                            background: 'var(--dark-bg)',
                            border: '1px solid var(--border-subtle)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                            zIndex: 10
                        }}>
                            {project.metrics.labels?.[hoveredPoint.pointIndex]}: {chartData[hoveredPoint.pointIndex].toLocaleString()}
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ height: '80px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    {project.metrics.type === 'speed' && (
                        <>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: '#ff6b6b' }}>{project.metrics.before}s</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Before</div>
                            </div>
                            <div style={{ fontSize: '18px', color: 'var(--primary)' }}>→</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-green)' }}>{project.metrics.after}s</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>After</div>
                            </div>
                        </>
                    )}
                    {project.metrics.type === 'comparison' && (
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <div style={{ flex: 0.25, height: '16px', background: 'linear-gradient(90deg, #ff6b6b, #c0392b)', borderRadius: '3px' }} />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{project.metrics.before}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, height: '16px', background: 'linear-gradient(90deg, var(--primary), var(--accent-green))', borderRadius: '3px' }} />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{project.metrics.after}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Results */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {project.results.slice(0, 2).map((result, i) => (
                    <span key={i} style={{
                        background: 'var(--dark-surface)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: 'var(--accent-green)',
                        fontWeight: 500
                    }}>✓ {result}</span>
                ))}
            </div>
        </motion.div>
    );
}

function ProjectDetailsPanel({ project, onClose }) {
    return (
        <div style={{
            background: 'var(--dark-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '40px'
        }}>
            {/* Left: Content */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '48px' }}>{project.icon}</span>
                        <div>
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>{project.industry}</span>
                            <h3 style={{ color: 'var(--text-primary)', margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>
                                {project.client}
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        fontSize: '28px',
                        cursor: 'pointer',
                        lineHeight: 1
                    }}>×</button>
                </div>

                {/* Challenge */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: 'var(--primary)' }}>⚠</span> The Challenge
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{project.challenge}</p>
                </div>

                {/* Solution */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: 'var(--primary)' }}>💡</span> Our Solution
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{project.solution}</p>
                </div>

                {/* Results */}
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: 'var(--accent-green)' }}>🏆</span> Results
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {project.results.map((result, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--accent-green)' }}>✓</span>
                                {result}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {project.techStack.map(tech => (
                        <span key={tech} style={{
                            background: 'var(--dark-surface)',
                            color: 'var(--primary)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 500
                        }}>{tech}</span>
                    ))}
                </div>
            </div>

            {/* Right: Animated Counter Visualization */}
            <AnimatedCounter project={project} />
        </div>
    );
}
