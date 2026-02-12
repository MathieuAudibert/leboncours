import {
  apiListCourses,
  apiListTeacherCourses,
  apiListEventCourses,
  apiListUsers,
  apiListMessageUsers,
  apiGetMessage,
} from '../api';

/**
 * Build the lookup maps (courses, users, courseTeacher) from raw API data.
 */
function buildMaps(coursesRes, usersRes, tcRes) {
  const courseMap = {};
  (coursesRes.data || []).forEach((c) => { courseMap[c.id] = c; });

  const userMap = {};
  (usersRes.data || []).forEach((u) => { userMap[u.id] = u; });

  const courseTeacherMap = {};
  (tcRes.data || []).forEach((tc) => {
    if (tc.course_id && tc.teacher_id) {
      courseTeacherMap[tc.course_id] = tc.teacher_id;
    }
  });

  return { courseMap, userMap, courseTeacherMap };
}

/**
 * Build sessions list + myCourses for a teacher.
 */
function buildTeacherData(user, allEvents, tcRes, courseMap, userMap) {
  const myTcIds = (tcRes.data || [])
    .filter((tc) => tc.teacher_id === user.id)
    .map((tc) => tc.course_id);

  const sessionsList = allEvents
    .filter((ev) => myTcIds.includes(ev.course_id))
    .map((ev) => {
      const student = userMap[ev.student_id];
      return {
        ...ev,
        subject: courseMap[ev.course_id]?.subject || 'Unknown',
        level: courseMap[ev.course_id]?.level || null,
        personName: student ? `${student.firstname} ${student.name}` : 'Student',
        personLabel: 'Student',
      };
    });

  const myCourses = myTcIds.map((cid) => courseMap[cid]).filter(Boolean);

  return { sessionsList, myCourses };
}

/**
 * Build sessions list + enrolled courses for a student.
 */
function buildStudentData(user, allEvents, courseMap, userMap, courseTeacherMap) {
  const sessionsList = allEvents
    .filter((ev) => ev.student_id === user.id)
    .map((ev) => {
      const tid = courseTeacherMap[ev.course_id];
      const teacher = tid ? userMap[tid] : null;
      return {
        ...ev,
        subject: courseMap[ev.course_id]?.subject || 'Unknown',
        level: courseMap[ev.course_id]?.level || null,
        personName: teacher ? `${teacher.firstname} ${teacher.name}` : 'Teacher',
        personLabel: 'Teacher',
      };
    });

  const enrolledIds = [...new Set(sessionsList.map((s) => s.course_id).filter(Boolean))];
  const myCourses = enrolledIds.map((cid) => {
    const teacher_id = courseTeacherMap[cid];
    const teacher = teacher_id ? userMap[teacher_id] : null;
    return {
      ...courseMap[cid],
      teacher: teacher ? `${teacher.firstname} ${teacher.name}` : null,
    };
  }).filter((c) => c.id);

  return { sessionsList, myCourses };
}

/**
 * Derive notifications from sessions.
 */
export function buildNotifications(sessionsList) {
  return sessionsList.slice(0, 3).map((s) => ({
    id: s.id,
    text: s.state === 'Confirmed'
      ? `Session "${s.subject}" with ${s.personName} is confirmed.`
      : s.state === 'Pending'
        ? `Session "${s.subject}" with ${s.personName} is pending.`
        : `Session "${s.subject}" status: ${s.state}`,
    type: s.state === 'Confirmed' ? 'success' : 'reminder',
  }));
}

/**
 * Fetch and resolve recent messages for the user.
 */
export async function fetchMessages(user, userMap, token) {
  const [sentRes, recvRes] = await Promise.all([
    apiListMessageUsers({ sender_id: user.id, per_page: 5 }, token).catch(() => ({ data: [] })),
    apiListMessageUsers({ receiver_id: user.id, per_page: 5 }, token).catch(() => ({ data: [] })),
  ]);

  const allMu = [...(sentRes.data || []), ...(recvRes.data || [])];
  const seen = new Set();
  const uniqueMu = allMu.filter((mu) => {
    if (seen.has(mu.message_id)) return false;
    seen.add(mu.message_id);
    return true;
  }).slice(0, 5);

  const msgPromises = uniqueMu.map(async (mu) => {
    try {
      const msg = await apiGetMessage(mu.message_id, token);
      const other = mu.sender_id === user.id ? userMap[mu.receiver_id] : userMap[mu.sender_id];
      return {
        id: mu.id,
        sender: other ? `${other.firstname} ${other.name}` : 'User',
        preview: msg?.content || '(no content)',
        time: msg?.created_at ? new Date(msg.created_at).toLocaleDateString() : '',
      };
    } catch {
      return null;
    }
  });

  return (await Promise.all(msgPromises)).filter(Boolean);
}

/**
 * Main data-fetching orchestrator for the dashboard.
 */
export async function fetchDashboardData(user, token, isTeacher) {
  const [coursesRes, usersRes, tcRes, evRes] = await Promise.all([
    apiListCourses({ per_page: 100 }),
    apiListUsers({ per_page: 100 }, token).catch(() => ({ data: [] })),
    apiListTeacherCourses({ per_page: 100 }, token).catch(() => ({ data: [] })),
    apiListEventCourses({ per_page: 100 }, token).catch(() => ({ data: [] })),
  ]);

  const { courseMap, userMap, courseTeacherMap } = buildMaps(coursesRes, usersRes, tcRes);
  const allEvents = evRes.data || [];

  const { sessionsList, myCourses } = isTeacher
    ? buildTeacherData(user, allEvents, tcRes, courseMap, userMap)
    : buildStudentData(user, allEvents, courseMap, userMap, courseTeacherMap);

  const notifications = buildNotifications(sessionsList);
  const messages = await fetchMessages(user, userMap, token);

  return { sessionsList, myCourses, notifications, messages };
}

/**
 * Build stat cards for teacher or student.
 */
export function buildStats(isTeacher, myCourses, upcomingSessions) {
  if (isTeacher) {
    return [
      { icon: 'BookOpen', value: myCourses.length, label: 'Courses Teaching' },
      { icon: 'Calendar', value: upcomingSessions.length, label: 'Total Sessions' },
      { icon: 'CheckCircle', value: upcomingSessions.filter(s => s.state === 'Confirmed').length, label: 'Confirmed' },
      { icon: 'TrendingUp', value: `€${myCourses.reduce((s, c) => s + (c.hourly_price || 0), 0)}`, label: 'Total Hourly' },
    ];
  }
  return [
    { icon: 'BookOpen', value: myCourses.length, label: 'Enrolled Courses' },
    { icon: 'Calendar', value: upcomingSessions.filter(s => s.state === 'Confirmed').length, label: 'Confirmed Sessions' },
    { icon: 'Clock', value: upcomingSessions.length, label: 'Total Sessions' },
    { icon: 'Star', value: upcomingSessions.filter(s => s.state === 'Done').length, label: 'Completed' },
  ];
}
