export const COLORS = ['#2d5a8c', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function buildSessionsPerDay(sessions) {
    const counts = DAYS.map(() => 0);
    (sessions || []).forEach((s) => {
        if (!s.dates) return;
        const d = new Date(s.dates);
        const dow = (d.getDay() + 6) % 7;
        counts[dow]++;
    });
    return DAYS.map((day, i) => ({ day, sessions: counts[i] }));
}

export function buildCourseDistribution(courses) {
    if (!courses || courses.length === 0) return [{ name: 'No courses', value: 1 }];
    return courses.map((c) => ({ name: c.subject || 'Unknown', value: 1 }));
}

export function buildSessionsByState(sessions) {
    const stateMap = {};
    (sessions || []).forEach((s) => {
        const st = s.state || 'Unknown';
        stateMap[st] = (stateMap[st] || 0) + 1;
    });
    const result = Object.entries(stateMap).map(([name, value]) => ({ name, value }));
    return result.length > 0 ? result : [{ name: 'No sessions', value: 1 }];
}

export function buildSessionsOverTime(sessions) {
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
