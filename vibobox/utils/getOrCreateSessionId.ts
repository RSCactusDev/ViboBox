/* import { v4 as uuidv4 } from 'uuid'; // To generate unique session IDs
import { cookies } from 'next/headers';

export function getOrCreateSessionId() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    sessionId = uuidv4(); // Generate a new session ID
    cookieStore.set('sessionId', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 7 }); // Store for 1 week
  }

  return sessionId;
}
 */

import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'sessionId';

export function getOrCreateSessionId() {
  // Access cookies using Next.js headers (for server-side access)
  const cookieStore = cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // If no session ID exists, generate a new one
  if (!sessionId) {
    sessionId = uuidv4(); // Generate a new unique session ID

    // Set the session ID in a cookie
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      path: '/', // Make the cookie available throughout the site
      maxAge: 60 * 60 * 24 * 7, // Set cookie expiration to 1 week
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    });
  }

  return sessionId;
}