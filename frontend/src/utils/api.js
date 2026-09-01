const API_BASE = '/api';

export function getSessionId() {
  let sessionId = localStorage.getItem('knipsen_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('knipsen_session_id', sessionId);
  }
  return sessionId;
}

export async function createEvent(data) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create event');
  }
  return res.json();
}

export async function getEventByCode(code) {
  const res = await fetch(`${API_BASE}/events/code/${encodeURIComponent(code)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Event-Code ungültig oder nicht gefunden.');
  }
  return res.json();
}

export async function getEventDetails(eventId, token = '') {
  const url = `${API_BASE}/events/${eventId}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  const headers = {};
  if (token) headers['x-admin-token'] = token;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch event details');
  }
  return res.json();
}

export async function uploadMedia(eventId, files, guestName = '', caption = '', audioBlob = null, onProgress = null) {
  const formData = new FormData();
  formData.append('guestName', guestName);
  formData.append('caption', caption);
  formData.append('sessionId', getSessionId());

  for (const file of files) {
    let safeFile = file;
    try {
      if (file && typeof file.arrayBuffer === 'function') {
        const buf = await file.arrayBuffer();
        if (buf && buf.byteLength > 0) {
          const type = file.type || 'image/jpeg';
          const name = file.name || 'photo.jpg';
          safeFile = new File([buf], name, { type });
        }
      }
    } catch (e) {
      console.warn('File arrayBuffer fallback used:', e);
    }
    formData.append('files', safeFile);
  }
  if (audioBlob) {
    formData.append('audio', audioBlob, 'voicenote.webm');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/events/${eventId}/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve({ message: 'Upload successful' });
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || 'Upload fehlgeschlagen.'));
        } catch (e) {
          reject(new Error('Upload fehlgeschlagen.'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Netzwerkfehler beim Upload. Bitte Verbindung prüfen.'));
    xhr.send(formData);
  });
}

export async function getEventMedia(eventId, token = '') {
  const url = `${API_BASE}/events/${eventId}/media${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  const headers = {};
  if (token) headers['x-admin-token'] = token;

  const res = await fetch(url, { headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to load gallery media');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function likeMedia(eventId, mediaId) {
  const res = await fetch(`${API_BASE}/events/${eventId}/media/${mediaId}/like`, {
    method: 'POST'
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to like item');
  }
  return res.json();
}

export async function incrementMediaView(eventId, mediaId, guestName = '') {
  const sessionId = getSessionId();
  const res = await fetch(`${API_BASE}/events/${eventId}/media/${mediaId}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, guestName })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to record view');
  }
  return res.json();
}

export async function deleteMedia(eventId, mediaId, token = '', guestName = '') {
  const headers = {};
  if (token) headers['x-admin-token'] = token;
  const sessionId = getSessionId();
  if (sessionId) headers['x-session-id'] = sessionId;
  if (guestName) headers['x-guest-name'] = guestName;

  const res = await fetch(`${API_BASE}/events/${eventId}/media/${mediaId}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Fehler beim Löschen des Fotos');
  }
  return res.json();
}

export async function getEventStats(eventId, token) {
  const res = await fetch(`${API_BASE}/events/${eventId}/stats`, {
    headers: { 'x-admin-token': token }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch event stats');
  }
  return res.json();
}

export async function updateEvent(eventId, updateData, token) {
  const res = await fetch(`${API_BASE}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update event');
  }
  return res.json();
}

export async function getGuestbookEntries(eventId) {
  const res = await fetch(`${API_BASE}/events/${eventId}/guestbook`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Fehler beim Laden des Gästebuchs');
  }
  return res.json();
}

export async function addGuestbookEntry(eventId, guestName, message) {
  const res = await fetch(`${API_BASE}/events/${eventId}/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestName, message })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Fehler beim Speichern des Eintrags');
  }
  return res.json();
}

export async function deleteGuestbookEntry(eventId, entryId, token = '') {
  const headers = {};
  if (token) headers['x-admin-token'] = token;
  const res = await fetch(`${API_BASE}/events/${eventId}/guestbook/${entryId}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Fehler beim Löschen des Eintrags');
  }
  return res.json();
}

