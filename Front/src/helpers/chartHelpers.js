export const COLORS = [
    '#0071E3',
    '#34C759',
    '#FF9F0A',
    '#FF3B30',
    '#AF52DE',
    '#FF2D55',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function buildSessionsPerDay(sessions) {
    const counts = DAYS.map(() => {
        return 0;
    });

    (sessions || []).forEach((s) => {
        if (!s.dates) {
            return;
        }
        const d = new Date(s.dates);
        const dow = (d.getDay() + 6) % 7;
        counts[dow]++;
    });

    return DAYS.map((day, i) => {
        return { day, sessions: counts[i] };
    });
}

export function buildCourseDistribution(courses) {
    if (!courses || courses.length === 0) {
        return [{ name: 'No courses', value: 1 }];
    }

    return courses.map((c) => {
        return { name: c.subject || 'Unknown', value: 1 };
    });
}

export function buildSessionsByState(sessions) {
    const stateMap = {};

    (sessions || []).forEach((s) => {
        const st = s.state || 'Unknown';
        stateMap[st] = (stateMap[st] || 0) + 1;
    });

    const result = Object.entries(stateMap).map(([name, value]) => {
        return { name, value };
    });

    if (result.length > 0) {
        return result;
    }
    return [{ name: 'No sessions', value: 1 }];
}

export function buildSessionsOverTime(sessions) {
    const months = {};

    (sessions || []).forEach((s) => {
        if (!s.dates) {
            return;
        }
        const d = new Date(s.dates);
        const key = d.toLocaleString('en', { month: 'short', year: '2-digit' });
        months[key] = (months[key] || 0) + 1;
    });

    const entries = Object.entries(months).map(([month, count]) => {
        return { month, sessions: count };
    });

    if (entries.length > 0) {
        return entries;
    }
    return [{ month: 'N/A', sessions: 0 }];
}
