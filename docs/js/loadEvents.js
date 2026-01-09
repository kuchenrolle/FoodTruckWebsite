function renderEventsMessage(container, message) {
  container.innerHTML = `<p class="events-message">${message}</p>`;
}

function formatEventDate(start, end, locale) {
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

function setupCalendarToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-button');
  const views = document.querySelectorAll('.calendar-view');

  if (!toggleButtons.length || !views.length) return;

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const viewName = button.getAttribute('data-view');

      toggleButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      views.forEach(view => {
        const isActive = view.getAttribute('data-view') === viewName;
        view.classList.toggle('is-active', isActive);
        view.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    });
  });
}

async function loadEvents() {
  const container = document.getElementById('events');
  if (!container) return;

  const calendarId = '13545b127c0f58d25e4e5172eb390bfcadf21b923dcb51eb9a26816f65d5d834@group.calendar.google.com';
  const apiKey = 'AIzaSyB2E5KbZ68Y3-mS72w7aH7kKIR6hUmpPJg';

  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${encodeURIComponent(now)}&singleEvents=true&orderBy=startTime&maxResults=20`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();
    const events = (data.items || []).filter(item => item.status !== 'cancelled');

    if (events.length === 0) {
      renderEventsMessage(container, 'No upcoming events right now. Check back soon.');
      return;
    }

    container.innerHTML = '';

    events.forEach(event => {
      const card = document.createElement('article');
      card.className = 'event-card';

      const title = document.createElement('h2');
      title.className = 'event-title';
      title.textContent = event.summary || 'Untitled Event';

      const date = document.createElement('p');
      date.className = 'event-date';
      date.textContent = formatEventDate(event.start, event.end, navigator.language);

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
    renderEventsMessage(container, 'Could not load events. Please try again later.');
  }
}

setupCalendarToggle();
loadEvents();
