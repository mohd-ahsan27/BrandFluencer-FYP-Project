const KEY = "bf_meetings";

function safeRead() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getMeetings() {
  return safeRead();
}

export function addMeeting(meeting) {
  const list = safeRead();
  list.unshift({
    id: `meet_${Date.now()}`,
    status: "pending",
    createdAt: Date.now(),
    ...meeting,
  });
  save(list);
  return list;
}

export function updateMeetingStatus(id, status) {
  const list = safeRead();
  const updated = list.map((m) => {
    if (String(m.id) !== String(id)) return m;
    return { ...m, status: status };
  });
  save(updated);
  return updated;
}