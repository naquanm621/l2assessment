/**
 * Frontend API wrapper for server-side classification
 * The backend handles AI logic and returns a structured analysis payload.
 */

export async function analyzeMessage(message) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || 'Failed to analyze message');
  }

  const data = await response.json();
  return data;
}
