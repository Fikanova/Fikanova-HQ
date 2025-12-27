/**
 * Agent Workforce Monitor
 * Displays L2 C-Suite status badges and efficiency bars
 */
import { useState, useEffect } from 'react';

const AgentWorkforceMonitor = () => {
    const [agents, setAgents] = useState([
        {
            id: 'cmo',
            name: 'CMO',
            title: 'The Narrative',
            icon: '📢',
            status: 'active',
            efficiency: 87,
            tasks24h: 12,
            subAgents: ['Marketing Lead', 'Editor'],
            color: '#ec4899'
        },
        {
            id: 'cfo',
            name: 'CFO',
            title: 'The Wealth',
            icon: '💰',
            status: 'active',
            efficiency: 94,
            tasks24h: 8,
            subAgents: ['Accounts Agent'],
            color: '#22c55e'
        },
        {
            id: 'cto',
            name: 'CTO',
            title: 'The Builder',
            icon: '🔧',
            status: 'idle',
            efficiency: 76,
            tasks24h: 5,
            subAgents: ['Dev Agent', 'Security Agent'],
            color: '#3b82f6'
        },
        {
            id: 'cio',
            name: 'CIO',
            title: 'Knowledge',
            icon: '📚',
            status: 'active',
            efficiency: 91,
            tasks24h: 15,
            subAgents: ['Librarian'],
            color: '#f59e0b'
        },
        {
            id: 'cimpo',
            name: 'CimpO',
            title: 'Governance',
            icon: '🛡️',
            status: 'monitoring',
            efficiency: 98,
            tasks24h: 23,
            subAgents: ['Audit Agent'],
            color: '#06b6d4'
        }
    ]);

    const statusStyles = {
        active: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', text: 'ACTIVE' },
        idle: { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', text: 'IDLE' },
        monitoring: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', text: 'MONITORING' },
        error: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', text: 'ERROR' }
    };

    return (
        <div style={{
            background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#e5e7eb' }}>
                        Agent Workforce Monitor
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                        L2 C-Suite Status • 5 Active Managers
                    </p>
                </div>
                <span style={{
                    padding: '4px 10px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '4px',
                    color: '#8b5cf6',
                    fontSize: '11px',
                    fontWeight: '600'
                }}>
                    LIVE
                </span>
            </div>

            {/* Agent Grid */}
            <div style={{ padding: '16px' }}>
                {agents.map((agent, index) => (
                    <div
                        key={agent.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 120px',
                            alignItems: 'center',
                            padding: '16px',
                            marginBottom: index < agents.length - 1 ? '8px' : 0,
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {/* Agent Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `${agent.color}20`,
                                border: `1px solid ${agent.color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '22px'
                            }}>
                                {agent.icon}
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: '700',
                                    color: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {agent.name}
                                    <span style={{
                                        padding: '2px 8px',
                                        fontSize: '10px',
                                        background: statusStyles[agent.status].bg,
                                        color: statusStyles[agent.status].color,
                                        borderRadius: '4px',
                                        fontWeight: '600'
                                    }}>
                                        {statusStyles[agent.status].text}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginTop: '2px'
                                }}>
                                    {agent.title} • {agent.subAgents.join(', ')}
                                </div>
                            </div>
                        </div>

                        {/* Efficiency Bar */}
                        <div style={{ padding: '0 20px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '6px'
                            }}>
                                <span style={{ fontSize: '11px', color: '#6b7280' }}>Efficiency</span>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: agent.efficiency > 80 ? '#22c55e' : agent.efficiency > 60 ? '#f59e0b' : '#ef4444'
                                }}>
                                    {agent.efficiency}%
                                </span>
                            </div>
                            <div style={{
                                height: '6px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${agent.efficiency}%`,
                                    height: '100%',
                                    background: agent.efficiency > 80 ? '#22c55e' : agent.efficiency > 60 ? '#f59e0b' : '#ef4444',
                                    borderRadius: '3px',
                                    transition: 'width 0.5s ease'
                                }}></div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: agent.color
                            }}>
                                {agent.tasks24h}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                tasks/24h
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentWorkforceMonitor;
