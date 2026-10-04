import { google } from 'googleapis';

async function indexUrls() {
  const serviceAccountKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountKeyPath) {
    console.error('Missing GOOGLE_APPLICATION_CREDENTIALS environment variable');
    process.exit(1);
  }

  // Initialize the Google Auth client
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const indexing = google.indexing({
    version: 'v3',
    auth: client as any,
  });

  // URLs can be passed via environment variables or read from a JSON file.
  // We'll read from process.env.URLS_TO_INDEX (comma separated)
  const newUrls = process.env.URLS_TO_INDEX ? process.env.URLS_TO_INDEX.split(',') : [];

  if (newUrls.length === 0) {
    console.log('No new URLs to index provided. Please set URLS_TO_INDEX.');
    return;
  }

  for (const url of newUrls) {
    const cleanUrl = url.trim();
    if (!cleanUrl) continue;
    
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: cleanUrl,
          type: 'URL_UPDATED',
        },
      });
      console.log(`Successfully submitted ${cleanUrl}:`, response.data);
    } catch (error: any) {
      console.error(`Error submitting ${cleanUrl}:`, error.message);
    }
  }
}

indexUrls().catch(console.error);
