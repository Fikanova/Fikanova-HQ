import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * FIKANOVA IMPACT DASHBOARD
 * Uses CSS variables for theme support (dark/light mode)
 * Impact stats only - Case Studies moved to separate page
 */

export default function ImpactDashboard() {
    const [ticker, setTicker] = useState({ hours: 48, agents: 3 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTicker(prev => ({
                hours: prev.hours + (Math.random() > 0.7 ? 1 : 0),
                agents: Math.max(2, Math.min(5, prev.agents + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="impact-dashboard">
            {/* Live Ticker Bar */}
            <div className="ticker-bar">
                <div className="ticker-content">
                    <TickerStat label="Hours Saved" value={`${ticker.hours}h`} type="highlight" />
                    <span className="ticker-divider" />
                    <TickerStat label="Active Agents" value={ticker.agents} type="success" pulse />
                    <span className="ticker-divider" />
                    <TickerStat label="Early Partners" value="3" type="highlight" />
                    <span className="ticker-divider" />
                    <TickerStat label="System Status" value="Operational" type="success" />
                </div>
            </div>

            {/* Section Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h2 className="dashboard-title">Pre-Launch Metrics</h2>
                    <span className="live-badge">
                        <span className="live-dot" />
                        Live
                    </span>
                </div>
                <p className="dashboard-subtitle">Early-stage performance tracking as we build and launch</p>
            </div>

            {/* Metric Cards */}
            <div className="metrics-grid">
                <MetricCard
                    title="Time Saved"
                    value="48 hrs"
                    change={12}
                    chartData={[5, 8, 12, 15, 22, 28, 32, 38, 44, 48]}
                    type="green"
                />
                <MetricCard
                    title="Early Clients"
                    value="3"
                    change={50}
                    chartData={[0, 0, 1, 1, 1, 2, 2, 2, 3, 3]}
                    type="blue"
                />
                <MetricCard
                    title="Avg. Delivery"
                    value="1.8x"
                    change={22}
                    chartData={[1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.75, 1.8]}
                    type="default"
                />
            </div>

            {/* Distribution Charts */}
            <div className="charts-grid">
                <DonutCard
                    title="Focus Areas"
                    data={[
                        { label: 'Web Development', value: 40, color: '#3b82f6' },
                        { label: 'AI Automation', value: 35, color: '#c9a962' },
                        { label: 'Consulting', value: 25, color: '#10b981' }
                    ]}
                />
                <DonutCard
                    title="Client Stage"
                    data={[
                        { label: 'Active Projects', value: 60, color: '#3b82f6' },
                        { label: 'In Discussion', value: 25, color: '#10b981' },
                        { label: 'Completed', value: 15, color: '#c9a962' }
                    ]}
                />
            </div>

            {/* Pipeline Table */}
            <div className="regional-section">
                <div className="regional-header">
                    <span className="regional-title">Pipeline Overview</span>
                    <span className="regional-status">● Pre-launch</span>
                </div>
                <table className="regional-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Type</th>
                            <th>Stage</th>
                            <th>Progress</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RegionRow region="Client Website v1" services="Web Dev" clients="In Progress" satisfaction="75%" status="active" />
                        <RegionRow region="AI Chatbot MVP" services="AI/ML" clients="Building" satisfaction="45%" status="growing" />
                        <RegionRow region="Internal Tools" services="Automation" clients="Testing" satisfaction="90%" status="active" />
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .impact-dashboard {
          font-family: 'Inter', sans-serif;
        }

        /* Ticker Bar - Premium Glass */
        .ticker-bar {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 18px 28px;
          margin-bottom: 36px;
          position: relative;
          overflow: hidden;
        }

        .ticker-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.4), transparent);
        }

        .ticker-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .ticker-divider {
          width: 1px;
          height: 20px;
          background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
        }

        .dashboard-title {
          font-size: 26px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #c9a962 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: var(--accent-green);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 28px;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 28px;
        }

        /* Regional Section - Premium Table */
        .regional-section {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .regional-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent);
        }

        .regional-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }

        .regional-title {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
        }

        .regional-status {
          font-size: 11px;
          color: var(--accent-green);
          font-weight: 600;
        }

        .regional-table {
          width: 100%;
          border-collapse: collapse;
        }

        .regional-table th {
          padding: 14px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(255, 255, 255, 0.02);
        }

        .regional-table td {
          padding: 16px 20px;
          font-size: 13px;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .regional-table tr:last-child td {
          border-bottom: none;
        }

        .regional-table tr:hover td {
          background: rgba(201, 169, 98, 0.03);
        }

        @media (max-width: 768px) {
          .ticker-content {
            gap: 20px;
          }
          .ticker-divider {
            display: none;
          }
          .regional-section {
            margin-left: -12px;
            margin-right: -12px;
            border-radius: 0;
            overflow-x: auto;
          }
          .regional-table {
            font-size: 12px;
            min-width: 450px;
          }
          .regional-table th,
          .regional-table td {
            padding: 12px 14px;
            white-space: nowrap;
          }
        }
      `}</style>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TickerStat({ label, value, type, pulse }) {
    const typeClasses = {
        highlight: 'var(--primary)',
        success: 'var(--accent-green)',
        default: 'var(--text-secondary)'
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}:</span>
            <span style={{
                color: typeClasses[type],
                fontWeight: 700,
                fontFamily: 'monospace',
                animation: pulse ? 'pulse 2s infinite' : 'none'
            }}>{value}</span>
        </div>
    );
}

function MetricCard({ title, value, change, chartData, type }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const max = Math.max(...chartData);
    const colors = {
        green: '#10b981',
        blue: '#3b82f6',
        default: '#c9a962'
    };
    const color = colors[type] || colors.default;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25), 0 0 50px rgba(201, 169, 98, 0.08)' }}
            transition={{ duration: 0.3 }}
            style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Gradient top border */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${color}40, transparent)`
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px' }}>{title}</span>
                <span style={{
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '12px'
                }}>+{change}%</span>
            </div>
            <div style={{
                fontSize: '32px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 0%, #c9a962 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '18px'
            }}>{value}</div>
            <div style={{ height: '70px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 70" preserveAspectRatio="none">
                    {/* Minimal single line */}
                    <path
                        d={`M${chartData.map((v, i) => `${(i / (chartData.length - 1)) * 100},${70 - (v / max) * 55}`).join(' L')}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Interactive data points - tiny dots */}
                    {chartData.map((v, i) => (
                        <circle
                            key={i}
                            cx={(i / (chartData.length - 1)) * 100}
                            cy={70 - (v / max) * 55}
                            r={hoveredPoint === i ? 3 : 1.5}
                            fill={color}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                opacity: hoveredPoint === i ? 1 : 0.7
                            }}
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        />
                    ))}
                </svg>
                {/* Tooltip */}
                {hoveredPoint !== null && (
                    <div style={{
                        position: 'absolute',
                        left: `${(hoveredPoint / (chartData.length - 1)) * 100}%`,
                        top: `${70 - (chartData[hoveredPoint] / max) * 55 - 12}%`,
                        transform: 'translate(-50%, -100%)',
                        background: 'rgba(0, 0, 0, 0.9)',
                        border: `1px solid ${color}`,
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: color,
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        {chartData[hoveredPoint]}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function DonutCard({ title, data }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, boxShadow: '0 25px 70px rgba(0, 0, 0, 0.25), 0 0 50px rgba(201, 169, 98, 0.08)' }}
            transition={{ duration: 0.3 }}
            style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Gradient top border */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent)'
            }} />

            <div style={{ marginBottom: '18px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px' }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                <div style={{ width: '110px', height: '110px', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))' }}>
                        {data.map((seg, i) => {
                            const start = cumulative;
                            cumulative += (seg.value / total) * 100;
                            return (
                                <circle key={i} cx="50" cy="50" r="38" fill="none"
                                    stroke={seg.color} strokeWidth="14"
                                    strokeDasharray={`${(seg.value / total) * 238.76} 238.76`}
                                    strokeDashoffset={-start * 2.3876}
                                    style={{ filter: `drop-shadow(0 0 8px ${seg.color}40)` }}
                                />
                            );
                        })}
                    </svg>
                    {/* Center value */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{total}%</div>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '3px',
                                    background: item.color,
                                    boxShadow: `0 0 8px ${item.color}60`
                                }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                            </div>
                            <span style={{
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                fontFamily: 'monospace'
                            }}>{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function RegionRow({ region, services, clients, satisfaction, status }) {
    return (
        <tr>
            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{region}</td>
            <td>{services}</td>
            <td style={{ color: 'var(--accent-blue)' }}>{clients}</td>
            <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{satisfaction}</td>
            <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: status === 'growing' ? 'var(--accent-blue)' : 'var(--accent-green)',
                        animation: status === 'growing' ? 'pulse 2s infinite' : 'none'
                    }} />
                    <span style={{
                        color: status === 'growing' ? 'var(--accent-blue)' : 'var(--accent-green)',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                    }}>{status}</span>
                </span>
            </td>
        </tr>
    );
}
