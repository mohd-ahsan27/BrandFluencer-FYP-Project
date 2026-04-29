const KEY = "bf_payments";

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

export function getPayments() {
  return safeRead();
}

export function addPayment(payment) {
  const list = safeRead();
  list.unshift({
    id: `pay_${Date.now()}`,
    status: "pending",
    createdAt: Date.now(),
    ...payment,
  });
  save(list);
  return list;
}

export function updatePaymentStatus(id, status) {
  const list = safeRead();
  const updated = list.map((p) => {
    if (String(p.id) !== String(id)) return p;
    return { ...p, status: status };
  });
  save(updated);
  return updated;
}