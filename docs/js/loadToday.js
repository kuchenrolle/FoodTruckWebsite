function renderTodayMessage(container, message) {
  container.innerHTML = `<p class="events-message">${message}</p>`;
}

function formatTodayEventDate(start, end, locale) {
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const dateFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  if (start.date) {
    const startDate = new Date(start.date + 'T00:00:00');
    return dateFormat.format(startDate);
  }

  const startDateTime = new Date(start.dateTime);
  const endDateTime = end && end.dateTime ? new Date(end.dateTime) : null;

  if (!endDateTime) {
    return dateTimeFormat.format(startDateTime);
  }

  const startText = dateTimeFormat.format(startDateTime);
  const endTimeFormat = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${startText} - ${endTimeFormat.format(endDateTime)}`;
}

function getTodayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

async function loadToday() {
  const container = document.getElementById('today-events');
  const fallback = document.getElementById('regular-schedule');
  if (!container || !fallback) return;

  const calendarId = '13545b127c0f58d25e4e5172eb390bfcadf21b923dcb51eb9a26816f65d5d834@group.calendar.google.com';
  const apiKey = 'AIzaSyB2E5KbZ68Y3-mS72w7aH7kKIR6hUmpPJg';

  const { start, end } = getTodayBounds();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${encodeURIComponent(start.toISOString())}&timeMax=${encodeURIComponent(end.toISOString())}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    const events = (data.items || []).filter(item => item.status !== 'cancelled');

    if (events.length === 0) {
      renderTodayMessage(container, 'No scheduled stops today!');
      fallback.setAttribute('aria-hidden', 'false');
      return;
    }

    container.innerHTML = '';
    fallback.setAttribute('aria-hidden', 'true');

    events.forEach(event => {
      const card = document.createElement('article');
      card.className = 'event-card';

      const date = document.createElement('p');
      date.className = 'event-date';
      date.textContent = formatTodayEventDate(event.start, event.end, navigator.language);

      const title = document.createElement('h2');
      title.className = 'event-title';
      title.textContent = event.summary || 'Today';

      card.appendChild(date);
      card.appendChild(title);

      if (event.location) {
        const location = document.createElement('p');
        location.className = 'event-meta';
        location.textContent = event.location;
        card.appendChild(location);
      }

      if (event.description) {
        const description = document.createElement('p');
        description.className = 'event-description';
        description.textContent = event.description;
        card.appendChild(description);
      }

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    renderTodayMessage(container, 'Could not load today\'s events. Here is our regular schedule:');
    fallback.setAttribute('aria-hidden', 'false');
  }
}

loadToday();
