# Feature: Calendar Search

> **Priority**: 2 (Power Feature)
> **Status**: To Build
> **Cozi Comparison**: Cozi gates search behind Gold ($39/yr)

---

## Overview

Full-text search across all calendar events - past and future. Users can find events by title, location, description, or assigned family member. Cozi paywalls this feature; we'll include it for all users.

---

## User Stories

1. **As a user**, I want to search for events by keyword so I can quickly find what I'm looking for
2. **As a parent**, I want to search for all of one child's events
3. **As a user**, I want to find past events to reference details (e.g., "What restaurant was that dinner at?")
4. **As a user**, I want to filter search results by date range

---

## Design Specifications

### Search Entry Point

```
Calendar Header:
┌─────────────────────────────────────────────────────┐
│  Calendar                        🔍    📅    [+]   │
│  Tuesday, January 28                                │
└─────────────────────────────────────────────────────┘
                                    ↑
                              Search icon
```

### Search Interface

```
┌─────────────────────────────────────────────────────┐
│  🔍 [ Search events...                    ]  Cancel│
├─────────────────────────────────────────────────────┤
│                                                     │
│  RECENT SEARCHES                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │  🕐 Soccer                                  │   │
│  │  🕐 Dentist                                 │   │
│  │  🕐 Sarah                                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  SUGGESTED                                          │
│  ┌─────────────────────────────────────────────┐   │
│  │  👤 Events with Sarah                       │   │
│  │  👤 Events with Jake                        │   │
│  │  📍 Events at School                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Search Results

```
┌─────────────────────────────────────────────────────┐
│  🔍 [ Soccer                              ]  Cancel│
├─────────────────────────────────────────────────────┤
│                                                     │
│  [ All ] [ Upcoming ] [ Past ]   [ Filter ▼ ]      │
│                                                     │
│  12 results for "Soccer"                            │
│                                                     │
│  UPCOMING                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │  Soccer Practice                             │   │
│  │  Sat, Feb 1 · 9:00 AM · Sarah               │   │
│  │  Lincoln Park Field                          │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Soccer Game vs Eagles                       │   │
│  │  Sat, Feb 8 · 2:00 PM · Sarah               │   │
│  │  Central Stadium                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  PAST                                               │
│  ┌─────────────────────────────────────────────┐   │
│  │  Soccer Practice                             │   │
│  │  Sat, Jan 25 · 9:00 AM · Sarah              │   │
│  │  Lincoln Park Field                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Filter Sheet

```
┌─────────────────────────────────────────────────────┐
│              Filter Results                  [ × ]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Date Range                                         │
│  ○ All time                                        │
│  ○ Past year                                       │
│  ○ Past month                                      │
│  ○ Next month                                      │
│  ○ Custom range...                                 │
│                                                     │
│  Family Member                                      │
│  [ All ] [●Sarah] [●Jake] [●Mom] [●Dad]           │
│                                                     │
│  Calendar                                           │
│  [✓] Personal  [✓] Work  [✓] Kids                 │
│                                                     │
│              [ Apply Filters ]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Search Fields

| Field | Weight | Example Match |
|-------|--------|---------------|
| Title | High | "Soccer Practice" matches "soccer" |
| Description | Medium | "Bring snacks" matches "snacks" |
| Location | Medium | "Lincoln Park" matches "lincoln" |
| Assigned member | High | "Sarah" matches Sarah's events |
| Calendar name | Low | "Work" matches work calendar events |

### Database Setup

```sql
-- Add full-text search index
ALTER TABLE events ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'B')
  ) STORED;

CREATE INDEX idx_events_search ON events USING GIN(search_vector);

-- Search function
CREATE OR REPLACE FUNCTION search_events(
  search_query TEXT,
  family_id_param UUID,
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL,
  member_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  start_at TIMESTAMPTZ,
  location TEXT,
  assigned_to UUID[],
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.start_at,
    e.location,
    e.assigned_to,
    ts_rank(e.search_vector, plainto_tsquery('english', search_query)) AS rank
  FROM events e
  WHERE e.family_id = family_id_param
    AND e.search_vector @@ plainto_tsquery('english', search_query)
    AND (date_from IS NULL OR e.start_at >= date_from)
    AND (date_to IS NULL OR e.start_at <= date_to)
    AND (member_ids IS NULL OR e.assigned_to && member_ids)
  ORDER BY rank DESC, e.start_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

### Frontend Implementation

```typescript
// Debounced search hook
function useEventSearch(familyId: string) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    searchEvents(debouncedQuery, familyId)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery, familyId]);

  return { query, setQuery, results, loading };
}

async function searchEvents(
  query: string,
  familyId: string,
  filters?: SearchFilters
): Promise<Event[]> {
  const { data, error } = await supabase
    .rpc('search_events', {
      search_query: query,
      family_id_param: familyId,
      date_from: filters?.dateFrom,
      date_to: filters?.dateTo,
      member_ids: filters?.memberIds,
    });

  if (error) throw error;
  return data;
}
```

### Search Highlighting

```typescript
function highlightMatch(text: string, query: string): React.ReactNode {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <Text key={i} style={styles.highlight}>{part}</Text>
    ) : (
      part
    )
  );
}
```

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty query | Show recent searches + suggestions |
| No results | "No events found" + suggest creating one |
| Query < 2 chars | Don't search, show placeholder |
| Special characters | Escape for safety |
| Very long results | Paginate with "Load more" |
| Private events | Only show to authorized users |
| Deleted events | Don't include in search |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to first result | < 300ms |
| Full results loaded | < 500ms |
| Search debounce | 300ms |
| Max results | 50 initially, paginate |

---

## Cozi Comparison

| Aspect | Cozi Free | Cozi Gold | Calendara |
|--------|-----------|-----------|-----------|
| Search available | ❌ | ✅ | **✅ All users** |
| Search past events | ❌ | ✅ | **✅** |
| Filter by member | ❌ | ❌ | **✅** |
| Filter by date | ❌ | ❌ | **✅** |
| Recent searches | ❌ | ❌ | **✅** |

---

## Acceptance Criteria

- [ ] Search icon accessible from calendar header
- [ ] Search as you type (debounced)
- [ ] Results show title, date, location, assigned member
- [ ] Results grouped by Upcoming / Past
- [ ] Filter by date range works
- [ ] Filter by family member works
- [ ] Recent searches are saved locally
- [ ] Search respects event privacy settings
- [ ] Results return in < 500ms
- [ ] Search works offline for cached events

---

## Future Enhancements

1. **Natural language** - "Sarah's events next week"
2. **Voice search** - "Find all soccer games"
3. **Smart suggestions** - Predict what user is searching for
4. **Saved searches** - Pin frequent searches
5. **Search in attachments** - Find events with specific documents
6. **Global search** - Search across calendars, lists, recipes
