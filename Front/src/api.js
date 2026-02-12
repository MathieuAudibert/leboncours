const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001';

/* ── Generic fetch wrapper ── */
async function request(endpoint, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    // empty 204
    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message = data?.message || data?.error || `Request failed (${res.status})`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export async function apiLogin(email, password) {
    return request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
    });
}

export async function apiRegister({ name, firstname, email, role, password }) {
    return request('/api/auth/register', {
        method: 'POST',
        body: { name, firstname, email, role, password },
    });
}

export async function apiListCourses(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    if (params.subject) query.set('subject', params.subject);
    if (params.level) query.set('level', params.level);
    if (params.min_price) query.set('min_price', params.min_price);
    if (params.max_price) query.set('max_price', params.max_price);
    const qs = query.toString();
    return request(`/api/courses/all${qs ? `?${qs}` : ''}`);
}

export async function apiGetCourse(id) {
    return request(`/api/courses/${id}`);
}

export async function apiCreateCourse(courseData, token) {
    return request('/api/courses/create', {
        method: 'POST',
        body: courseData,
        token,
    });
}

export async function apiUpdateCourse(id, courseData, token) {
    return request(`/api/courses/edit/${id}`, {
        method: 'PUT',
        body: courseData,
        token,
    });
}

export async function apiDeleteCourse(id, token) {
    return request(`/api/courses/delete/${id}`, {
        method: 'DELETE',
        token,
    });
}

export async function apiGetUser(id, token) {
    return request(`/api/users/${id}`, { token });
}

export async function apiListUsers(params = {}, token) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    if (params.role) query.set('role', params.role);
    if (params.name) query.set('name', params.name);
    if (params.email) query.set('email', params.email);
    const qs = query.toString();
    return request(`/api/users/all${qs ? `?${qs}` : ''}`, { token });
}

export async function apiListTeacherCourses(params = {}, token) {
    const query = new URLSearchParams();
    if (params.teacher_id) query.set('teacher_id', params.teacher_id);
    if (params.course_id) query.set('course_id', params.course_id);
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    const qs = query.toString();
    return request(`/api/teacher-courses/all${qs ? `?${qs}` : ''}`, { token });
}

export async function apiCreateTeacherCourse(data, token) {
    return request('/api/teacher-courses/create', { method: 'POST', body: data, token });
}

export async function apiListEventCourses(params = {}, token) {
    const query = new URLSearchParams();
    if (params.student_id) query.set('student_id', params.student_id);
    if (params.course_id) query.set('course_id', params.course_id);
    if (params.state) query.set('state', params.state);
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    const qs = query.toString();
    return request(`/api/event-courses/all${qs ? `?${qs}` : ''}`, { token });
}

export async function apiCreateEventCourse(data, token) {
    return request('/api/event-courses/create', { method: 'POST', body: data, token });
}

export async function apiListAvailabilities(params = {}, token) {
    const query = new URLSearchParams();
    if (params.course_id) query.set('course_id', params.course_id);
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    const qs = query.toString();
    return request(`/api/availabilities/all${qs ? `?${qs}` : ''}`, { token });
}

export async function apiListMessages(params = {}, token) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    const qs = query.toString();
    return request(`/api/messages/all${qs ? `?${qs}` : ''}`, { token });
}

export async function apiGetMessage(id, token) {
    return request(`/api/messages/${id}`, { token });
}

export async function apiListMessageUsers(params = {}, token) {
    const query = new URLSearchParams();
    if (params.sender_id) query.set('sender_id', params.sender_id);
    if (params.receiver_id) query.set('receiver_id', params.receiver_id);
    if (params.message_id) query.set('message_id', params.message_id);
    if (params.page) query.set('page', params.page);
    if (params.per_page) query.set('per_page', params.per_page);
    const qs = query.toString();
    return request(`/api/message-users/all${qs ? `?${qs}` : ''}`, { token });
}
