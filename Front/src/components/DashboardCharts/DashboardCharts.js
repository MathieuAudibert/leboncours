import React, { memo, useMemo } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react';

/* ═══════════════════════════════════════
   CHART COLOUR PALETTE
   ═══════════════════════════════════════ */
const COLORS = ['#2d5a8c', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

/* ═══════════════════════════════════════
   CUSTOM TOOLTIP
   ═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   HELPERS — derive chart data from real props
   ═══════════════════════════════════════ */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildSessionsPerDay(sessions) {
    const counts = DAYS.map(() => 0);
    (sessions || []).forEach((s) => {
        if (!s.dates) return;
        const d = new Date(s.dates);
        const dow = (d.getDay() + 6) % 7; // Mon=0
        counts[dow]++;
    });
    return DAYS.map((day, i) => ({ day, sessions: counts[i] }));
}

function buildCourseDistribution(courses) {
    if (!courses || courses.length === 0) return [{ name: 'No courses', value: 1 }];
    return courses.map((c) => ({ name: c.subject || 'Unknown', value: 1 }));
}

function buildSessionsByState(sessions) {
    const stateMap = {};
    (sessions || []).forEach((s) => {
        const st = s.state || 'Unknown';
        stateMap[st] = (stateMap[st] || 0) + 1;
    });
    const result = Object.entries(stateMap).map(([name, value]) => ({ name, value }));
    return result.length > 0 ? result : [{ name: 'No sessions', value: 1 }];
}

function buildSessionsOverTime(sessions) {
    const months = {};
    (sessions || []).forEach((s) => {
        if (!s.dates) return;
        const d = new Date(s.dates);
        const key = d.toLocaleString('en', { month: 'short', year: '2-digit' });
        months[key] = (months[key] || 0) + 1;
    });
    const entries = Object.entries(months).map(([month, count]) => ({ month, sessions: count }));
    return entries.length > 0 ? entries : [{ month: 'N/A', sessions: 0 }];
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — powered by real data
   ═══════════════════════════════════════ */
const DashboardCharts = memo(function DashboardCharts({ isTeacher, sessions, courses }) {
    const charts = useMemo(() => {
        const sessionsPerDay = buildSessionsPerDay(sessions);
        const courseDist = buildCourseDistribution(courses);
        const sessionsByState = buildSessionsByState(sessions);
        const sessionsOverTime = buildSessionsOverTime(sessions);

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
                    title: 'Sessions Over Time',
                    icon: TrendingUp,
                    render: () => (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={sessionsOverTime}>
                                <defs>
                                    <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2d5a8c" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2d5a8c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#2d5a8c" strokeWidth={2.5} fill="url(#sessionsGradient)" />
                            </AreaChart>
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
                {
                    title: 'Session Status',
                    icon: Activity,
                    render: () => (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={sessionsByState}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    strokeWidth={0}
                                >
                                    {sessionsByState.map((_, i) => (
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
                title: 'Sessions Over Time',
                icon: TrendingUp,
                render: () => (
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={sessionsOverTime}>
                            <defs>
                                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#10B981" strokeWidth={2.5} fill="url(#progressGradient)" />
                        </AreaChart>
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
            {
                title: 'Session Status',
                icon: Activity,
                render: () => (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={sessionsByState}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                nameKey="name"
                                strokeWidth={0}
                            >
                                {sessionsByState.map((_, i) => (
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
