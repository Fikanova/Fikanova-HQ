/**
 * 3 Elements Market Monitor
 * CoinMarketCap-style display for Time, Knowledge, Wealth metrics
 */
import { useState, useEffect } from 'react';

const ElementsMonitor = () => {
    const [elements, setElements] = useState([
        {
            id: 'time',
            name: 'Time',
            symbol: 'TIME',
            icon: '⏳',
            value: 0,
            unit: 'hrs saved',
            change24h: 0,
            trend: 'up',
            description: 'Automation hours saved this month',
            color: '#8b5cf6'
        },
        {
            id: 'knowledge',
            name: 'Knowledge',
            symbol: 'KNOW',
            icon: '🧠',
            value: 0,
            unit: 'traces',
            change24h: 0,
            trend: 'up',
            description: 'Learning traces logged by agents',
            color: '#3b82f6'
        },
        {
            id: 'wealth',
            name: 'Wealth',
            symbol: 'WLTH',
            icon: '💰',
            value: 0,
            unit: 'KES',
            change24h: 0,
            trend: 'up',
            description: 'Revenue tracked this month',
            color: '#22c55e'
        }
    ]);

    // Fetch real metrics from Appwrite
    const fetchMetrics = async () => {
        try {
            // In production, fetch from Appwrite ESG_Metrics
            // For now, simulate with realistic data
            setElements(prev => prev.map(el => ({
                ...el,
                value: el.id === 'time' ? 127.5
                    : el.id === 'knowledge' ? 342
                        : 458000,
                change24h: el.id === 'time' ? 12.3
                    : el.id === 'knowledge' ? 8.7
                        : 15.2
            })));
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatValue = (el) => {
        if (el.id === 'wealth') {
            return `KES ${el.value.toLocaleString()}`;
        }
        return `${el.value.toLocaleString()} ${el.unit}`;
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h3 style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#e5e7eb'
                    }}>
                        The 3 Elements Theory
                    </h3>
                    <p style={{
                        margin: '4px 0 0',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>
                        Real-time value creation metrics
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: '#22c55e'
                }}>
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        animation: 'pulse 2s infinite'
                    }}></span>
                    LIVE
                </div>
            </div>

            {/* Market List */}
            <div style={{ padding: '8px 0' }}>
                {elements.map((el, index) => (
                    <div
                        key={el.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 100px',
                            alignItems: 'center',
                            padding: '16px 20px',
                            borderBottom: index < elements.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        {/* Element Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: `${el.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                {el.icon}
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: '600',
                                    color: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {el.name}
                                    <span style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        color: '#9ca3af'
                                    }}>
                                        {el.symbol}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginTop: '2px'
                                }}>
                                    {el.description}
                                </div>
                            </div>
                        </div>

                        {/* Value */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '18px',
                                color: el.color
                            }}>
                                {formatValue(el)}
                            </div>
                        </div>

                        {/* Change */}
                        <div style={{
                            textAlign: 'right',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: el.trend === 'up' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: el.trend === 'up' ? '#22c55e' : '#ef4444',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}>
                                {el.trend === 'up' ? '▲' : '▼'}
                                {el.change24h}%
                            </span>
                        </div>
                    </div>
                ))}
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

export default ElementsMonitor;
