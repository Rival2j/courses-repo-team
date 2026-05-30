(async () => {
  const SUP_URL = 'https://xqtfovmmndsloqnyqhfv.supabase.co';
  const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdGZvdm1tbmRzbG9xbnlxaGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTkzNDcsImV4cCI6MjA4NTE5NTM0N30._OW4oViHaE7H0YSmA-1rIyLxjJv1-XuDm7HrpVquyUg';
  const email = 'auth-sync-check2@example.test';
  const password = 'Sync-Check-123!';

  try {
    console.log('--- SIGNUP ---');
    const sResp = await fetch(`${SUP_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, data: { display_name: 'Alumno REST Client' } }),
    });
    const sBody = await sResp.text();
    console.log('SIGNUP status', sResp.status);
    console.log(sBody);

    console.log('--- TOKEN (signin) ---');
    const tResp = await fetch(`${SUP_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const tBody = await tResp.json();
    console.log('TOKEN status', tResp.status);
    console.log(JSON.stringify(tBody, null, 2));

    const access = tBody.access_token;
    const uid = tBody.user?.id;

    console.log('--- CALL /users/me ---');
    const meResp = await fetch('http://127.0.0.1:3000/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
    });
    const meBody = await meResp.text();
    console.log('ME status', meResp.status);
    console.log(meBody);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
