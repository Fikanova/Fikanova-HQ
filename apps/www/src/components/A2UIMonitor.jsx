/**
 * A2UI Monitor - Real-time Agent Activity Terminal
 * Displays live agent thoughts/actions from Appwrite agent_logs
 */
import { useState, useEffect, useRef } from 'react';

const A2UIMonitor = ({ maxLines = 50, autoScroll = true }) => {
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [filter, setFilter] = useState('all');
    const terminalRef = useRef(null);

    // Simulated log types with styling
    const logTypes = {
        CEO: { color: '#8b5cf6', icon: '👔' },
        CMO: { color: '#ec4899', icon: '📢' },
        CFO: { color: '#22c55e', icon: '💰' },
        CTO: { color: '#3b82f6', icon: '🔧' },
        CIO: { color: '#f59e0b', icon: '📚' },
        CimpO: { color: '#06b6d4', icon: '🛡️' },
        SYSTEM: { color: '#6b7280', icon: '⚙️' }
    };

    // Fetch logs from Appwrite
    const fetchLogs = async () => {
        try {
            // In production, replace with actual Appwrite SDK call
            const mockLogs = [
                { id: 1, agent_name: 'CEO', action: 'Routing intent: "Create new blog post"', status: 'success', logged_at: new Date().toISOString() },
                { id: 2, agent_name: 'CMO', action: 'Delegating to Marketing Lead Agent', status: 'processing', logged_at: new Date().toISOString() },
                { id: 3, agent_name: 'SYSTEM', action: 'HITL approval requested via HumanLayer', status: 'pending', logged_at: new Date().toISOString() },
            ];
            setLogs(prev => [...prev, ...mockLogs].slice(-maxLines));
            setIsConnected(true);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            setIsConnected(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (autoScroll && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.agent_name === filter);

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            success: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', text: '✓' },
            processing: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', text: '◐' },
            pending: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', text: '◔' },
            error: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: '✗' }
        };
        const style = styles[status] || styles.processing;
        return (
            <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '4px',
                background: style.bg,
                color: style.color,
                fontSize: '11px',
                fontWeight: '600'
            }}>
                {style.text} {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div style={{
            background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
        }}>
            {/* Terminal Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></span>
                    </div>
                    <span style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '13px' }}>
                        A2UI Terminal — Agent Activity Monitor
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: isConnected ? '#22c55e' : '#ef4444'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: isConnected ? '#22c55e' : '#ef4444',
                            animation: isConnected ? 'pulse 2s infinite' : 'none'
                        }}></span>
                        {isConnected ? 'LIVE' : 'DISCONNECTED'}
                    </span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: 'white',
                            fontSize: '11px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Agents</option>
                        {Object.keys(logTypes).map(agent => (
                            <option key={agent} value={agent}>{logTypes[agent].icon} {agent}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={terminalRef}
                style={{
                    height: '300px',
                    overflowY: 'auto',
                    padding: '12px 16px',
                    fontSize: '12px',
                    lineHeight: '1.8'
                }}
            >
                {filteredLogs.length === 0 ? (
                    <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
                        <p>Waiting for agent activity...</p>
                        <p style={{ fontSize: '11px', marginTop: '8px' }}>Connected to Appwrite agent_logs</p>
                    </div>
                ) : (
                    filteredLogs.map((log, index) => (
                        <div key={log.id || index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '8px',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '6px',
                            borderLeft: `3px solid ${logTypes[log.agent_name]?.color || '#6b7280'}`
                        }}>
                            <span style={{ color: '#6b7280', fontSize: '11px', minWidth: '70px' }}>
                                {formatTime(log.logged_at)}
                            </span>
                            <span style={{
                                color: logTypes[log.agent_name]?.color || '#6b7280',
                                fontWeight: '600',
                                minWidth: '60px'
                            }}>
                                {logTypes[log.agent_name]?.icon} {log.agent_name}
                            </span>
                            <span style={{ color: '#e5e7eb', flex: 1 }}>
                                {log.action}
                            </span>
                            {getStatusBadge(log.status)}
                        </div>
                    ))
                )}
            </div>

            {/* Terminal Footer */}
            <div style={{
                padding: '8px 16px',
                background: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#6b7280'
            }}>
                <span>{filteredLogs.length} entries</span>
                <span>Fikanova OS v3.0</span>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default A2UIMonitor;
