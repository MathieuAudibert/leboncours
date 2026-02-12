import React, { memo, useMemo } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
    COLORS,
    buildSessionsPerDay,
    buildCourseDistribution,
} from '../../helpers/chartHelpers';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <span className="chart-tooltip-label">{label}</span>
            {payload.map((entry, i) => (
                <div key={i} className="chart-tooltip-row">
                    <span className="chart-tooltip-dot" style={{ background: entry.color }} />
                    <span className="chart-tooltip-name">{entry.name}:</span>
                    <span className="chart-tooltip-value">{typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue') ? `€${entry.value}` : entry.value}</span>
                </div>
            ))}
        </div>
    );
}

const DashboardCharts = memo(function DashboardCharts({ isTeacher, sessions, courses }) {
    const charts = useMemo(() => {
        const sessionsPerDay = buildSessionsPerDay(sessions);
        const courseDist = buildCourseDistribution(courses);

        if (isTeacher) {
            return [
                {
                    title: 'Sessions This Week',
                    icon: BarChart3,
                    render: () => (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={sessionsPerDay} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="sessions" name="Sessions" fill="#2d5a8c" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ),
                },
                {
                    title: 'Courses',
                    icon: PieChartIcon,
                    render: () => (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={courseDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    strokeWidth={0}
                                >
                                    {courseDist.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 12, color: '#6B7280' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ),
                },
            ];
        }

        /* Student charts */
        return [
            {
                title: 'Sessions This Week',
                icon: BarChart3,
                render: () => (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sessionsPerDay} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="sessions" name="Sessions" fill="#2d5a8c" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ),
            },
            {
                title: 'Courses',
                icon: PieChartIcon,
                render: () => (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={courseDist}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                nameKey="name"
                                strokeWidth={0}
                            >
                                {courseDist.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: 12, color: '#6B7280' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ),
            },
        ];
    }, [isTeacher, sessions, courses]);

    return (
        <div className="dash-charts">
            <div className="dash-charts-grid">
                {charts.map((chart) => (
                    <div className="dash-chart-card" key={chart.title}>
                        <div className="dash-chart-header">
                            <chart.icon size={16} />
                            <h3 className="dash-chart-title">{chart.title}</h3>
                        </div>
                        <div className="dash-chart-body">
                            {chart.render()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default DashboardCharts;
