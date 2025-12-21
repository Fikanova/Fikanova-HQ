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
                    <TickerStat label="Clients Onboarded" value="8" type="highlight" />
                    <span className="ticker-divider" />
                    <TickerStat label="Uptime" value="99.9%" type="success" />
                </div>
            </div>

            {/* Section Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h2 className="dashboard-title">System Impact</h2>
                    <span className="live-badge">
                        <span className="live-dot" />
                        Live
                    </span>
                </div>
                <p className="dashboard-subtitle">Real-time performance metrics across Fikanova operations</p>
            </div>

            {/* Metric Cards */}
            <div className="metrics-grid">
                <MetricCard
                    title="Operational Savings"
                    value="KES 120K"
                    change={15}
                    chartData={[0, 5, 12, 18, 25, 35, 48, 65, 85, 120]}
                    type="green"
                />
                <MetricCard
                    title="SME Partners"
                    value="8"
                    change={25}
                    chartData={[0, 1, 2, 3, 4, 5, 6, 7, 8, 8]}
                    type="blue"
                />
                <MetricCard
                    title="Efficiency Gain"
                    value="2.4x"
                    change={18}
                    chartData={[1, 1.2, 1.4, 1.6, 1.8, 2, 2.1, 2.2, 2.3, 2.4]}
                    type="default"
                />
            </div>

            {/* Distribution Charts */}
            <div className="charts-grid">
                <DonutCard
                    title="Project Distribution"
                    data={[
                        { label: 'Web Development', value: 42, color: 'var(--accent-blue)' },
                        { label: 'AI Integration', value: 28, color: 'var(--primary)' },
                        { label: 'E-commerce', value: 18, color: 'var(--accent-green)' },
                        { label: 'Consulting', value: 12, color: 'var(--accent-gold)' }
                    ]}
                />
                <DonutCard
                    title="Revenue Channels"
                    data={[
                        { label: 'Project Work', value: 65, color: 'var(--accent-blue)' },
                        { label: 'Retainers', value: 25, color: 'var(--accent-green)' },
                        { label: 'Licensing', value: 10, color: 'var(--primary)' }
                    ]}
                />
            </div>

            {/* Regional Table */}
            <div className="regional-section">
                <div className="regional-header">
                    <span className="regional-title">Regional Impact</span>
                    <span className="regional-status">● Real-time</span>
                </div>
                <table className="regional-table">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>Services Offered</th>
                            <th>Clients</th>
                            <th>Satisfaction</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RegionRow region="Nairobi, KE" services={4} clients={5} satisfaction="98%" status="active" />
                        <RegionRow region="Mombasa, KE" services={2} clients={2} satisfaction="100%" status="growing" />
                        <RegionRow region="Remote / Global" services={3} clients={1} satisfaction="95%" status="active" />
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .impact-dashboard {
          font-family: 'Inter', sans-serif;
        }

        /* Ticker Bar */
        .ticker-bar {
          background: var(--dark-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 14px 24px;
          margin-bottom: 32px;
        }

        .ticker-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ticker-divider {
          width: 1px;
          height: 16px;
          background: var(--border-subtle);
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 28px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-green);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-green);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Regional Section */
        .regional-section {
          background: var(--dark-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          overflow: hidden;
        }

        .regional-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .regional-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .regional-status {
          font-size: 11px;
          color: var(--accent-green);
        }

        .regional-table {
          width: 100%;
          border-collapse: collapse;
        }

        .regional-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--dark-surface);
        }

        .regional-table td {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
        }

        .regional-table tr:last-child td {
          border-bottom: none;
        }

        .regional-table tr:hover td {
          background: var(--dark-surface);
        }

        @media (max-width: 768px) {
          .ticker-content {
            gap: 16px;
          }
          .ticker-divider {
            display: none;
          }
          .regional-table {
            font-size: 12px;
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
    const max = Math.max(...chartData);
    const colors = {
        green: 'var(--accent-green)',
        blue: 'var(--accent-blue)',
        default: 'var(--primary)'
    };
    const color = colors[type] || colors.default;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'var(--dark-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '20px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{title}</span>
                <span style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600 }}>+{change}%</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>{value}</div>
            <div style={{ height: '50px' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M0,50 ${chartData.map((v, i) => `L${(i / (chartData.length - 1)) * 100},${50 - (v / max) * 45}`).join(' ')} L100,50 Z`}
                        fill={`url(#grad-${type})`}
                    />
                    <path
                        d={`M${chartData.map((v, i) => `${(i / (chartData.length - 1)) * 100},${50 - (v / max) * 45}`).join(' L')}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
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
            style={{
                background: 'var(--dark-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '20px'
            }}
        >
            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                    <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        {data.map((seg, i) => {
                            const start = cumulative;
                            cumulative += (seg.value / total) * 100;
                            return (
                                <circle key={i} cx="50" cy="50" r="40" fill="none"
                                    stroke={seg.color} strokeWidth="12"
                                    strokeDasharray={`${(seg.value / total) * 251.2} 251.2`}
                                    strokeDashoffset={-start * 2.512}
                                />
                            );
                        })}
                    </svg>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {data.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}%</span>
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
