/**
 * A2UI Unified Monitor - Context-Aware Agent Interface
 * 
 * Modes:
 * - workforce: L2 Manager status badges (About Us)
 * - globalTrace: Aggregate action ticker (Impact)  
 * - projectPulse: Client-specific agent activity (Case Studies)
 */
import { useState, useEffect } from 'react';

const A2UIUnified = ({ mode = 'workforce', projectFilter = null }) => {
    const [logs, setLogs] = useState([]);
    const [globalStats, setGlobalStats] = useState({
        tokensOptimized: 4200000,
        tasksCompleted: 847,
        hoursReclaimed: 127.5,
        activeAgents: 5
    });

    const [agents, setAgents] = useState([
        { id: 'ceo', name: 'CEO', status: 'active', lastAction: 'Routing client intake' },
        { id: 'cmo', name: 'CMO', status: 'active', lastAction: 'Drafting Termite Stack' },
        { id: 'cfo', name: 'CFO', status: 'active', lastAction: 'Reconciling M-Pesa' },
        { id: 'cto', name: 'CTO', status: 'idle', lastAction: 'Monitoring deployments' },
        { id: 'cimpo', name: 'CimpO', status: 'monitoring', lastAction: 'Logging traces' }
    ]);

    const projectLogs = [
        { id: 1, agent: 'CFO', action: 'Reconciling eTIMS invoices', project: 'Nondescripts RFC', time: '09:12' },
        { id: 2, agent: 'CMO', action: 'Drafting social campaign', project: 'Jenga365', time: '09:15' },
        { id: 3, agent: 'CTO', action: 'Auto-healing CSS bundle', project: 'Jenga365', time: '09:20' },
        { id: 4, agent: 'CFO', action: 'Processing M-Pesa statement', project: 'Nondescripts RFC', time: '09:25' },
        { id: 5, agent: 'CIO', action: 'Indexing knowledge base', project: 'Internal', time: '09:30' }
    ];

    useEffect(() => {
        const filtered = projectFilter
            ? projectLogs.filter(l => l.project === projectFilter)
            : projectLogs;
        setLogs(filtered);

        // Simulate live updates
        const interval = setInterval(() => {
            setGlobalStats(prev => ({
                ...prev,
                tokensOptimized: prev.tokensOptimized + Math.floor(Math.random() * 1000),
                tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [projectFilter]);

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // WORKFORCE MODE: L2 Manager Status Badges (About Us)
    if (mode === 'workforce') {
        return (
            <div style={{
                background: 'linear-gradient(180deg, #0a0b0d 0%, #171924 100%)',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <div>
                        <h3 style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
                            Live Agent Workforce
                        </h3>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                            {agents.filter(a => a.status === 'active').length} of {agents.length} agents active
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '6px'
                    }}>
                        <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#22c55e', letterSpacing: '1px' }}>LIVE</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {agents.map(agent => (
                        <div key={agent.id} style={{
                            padding: '8px 12px',
                            background: agent.status === 'active' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                            border: `1px solid ${agent.status === 'active' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: agent.status === 'active' ? '#3b82f6' : agent.status === 'monitoring' ? '#f59e0b' : '#64748b',
                                animation: agent.status === 'active' ? 'pulse 2s infinite' : 'none'
                            }}></span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: agent.status === 'active' ? '#3b82f6' : '#94a3b8', fontFamily: 'monospace' }}>
                                {agent.name}
                            </span>
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    // GLOBAL TRACE MODE: Aggregate Ticker (Impact)
    if (mode === 'globalTrace') {
        return (
            <div style={{
                background: '#0a0b0d',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif"
            }}>
                {/* Stats Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
                }}>
                    {[
                        { label: 'Tokens Optimized', value: formatNumber(globalStats.tokensOptimized), color: '#3b82f6' },
                        { label: 'Tasks Today', value: globalStats.tasksCompleted, color: '#22c55e' },
                        { label: 'Hours Reclaimed', value: globalStats.hoursReclaimed.toFixed(1), color: '#8b5cf6' },
                        { label: 'Active Agents', value: globalStats.activeAgents, color: '#f59e0b' }
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '16px',
                            borderRight: i < 3 ? '1px solid rgba(71, 85, 105, 0.3)' : 'none',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                {stat.label}
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color, fontFamily: 'monospace' }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Feed */}
                <div style={{ padding: '16px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid rgba(71, 85, 105, 0.2)'
                    }}>
                        <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            A2UI_TRACE_FEED
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                        {logs.slice(0, 4).map(log => (
                            <div key={log.id} style={{ fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: '#475569', minWidth: '40px' }}>{log.time}</span>
                                <span style={{ color: '#3b82f6', fontWeight: '600' }}>[{log.agent}]</span>
                                <span style={{ color: '#94a3b8' }}>{log.action}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    // PROJECT PULSE MODE: Client-Specific Activity (Case Studies)
    if (mode === 'projectPulse') {
        const filteredLogs = projectFilter
            ? projectLogs.filter(l => l.project === projectFilter)
            : projectLogs;

        return (
            <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            background: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                        }}></span>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Project Pulse {projectFilter && `• ${projectFilter}`}
                        </span>
                    </div>
                    <span style={{
                        padding: '4px 8px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: '#22c55e'
                    }}>LIVE</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                    {filteredLogs.slice(0, 3).map(log => (
                        <div key={log.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px',
                            fontSize: '11px'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: '#3b82f6',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s infinite'
                            }}></span>
                            <span style={{ color: '#3b82f6', fontWeight: '600' }}>{log.agent}</span>
                            <span style={{ color: '#94a3b8', flex: 1 }}>{log.action}</span>
                            <span style={{ color: '#475569', fontSize: '10px' }}>{log.time}</span>
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
            </div>
        );
    }

    return null;
};

export default A2UIUnified;
