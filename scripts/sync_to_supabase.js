const path = require('path');
const { pathToFileURL } = require('url');

const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

function mapCompany(c, year) {
  return {
    slug: c.slug,
    batch_year: String(year),
    name: c.name,
    offers: c.offers || [],
    seasons: c.seasons || [],
    pay: c.pay || '',
    pay_kind: c.payKind || '',
    pay_rank: c.payRank || 0,
    dream: !!c.dream,
    logo: c.logo || '',
    out_students: c.out?.students || 0,
    out_internships: c.out?.internships || 0,
    out_fulltime: c.out?.fulltimeOffers || 0,
    out_ppo: c.out?.ppo || 0,
    open_branches: c.open || '',
    branches: c.branches || '',
    cgpa: typeof c.cgpa === 'number' ? c.cgpa : null,
    cgpa_criteria: c.cgpaCriteria || '',
    boards_criteria: c.boardsCriteria || '',
    first_date: c.first || '',
    last_date: c.last || '',
    visit_timeline: c.visitTimeline || '',
    funnel_raw: c.funnelRaw || '',
    status: c.status || '',
    roles: c.roles || []
  };
}

async function syncAll() {
  const comp2027Path = pathToFileURL(path.resolve(__dirname, '../src/data/companies.js')).href;
  const comp2028Path = pathToFileURL(path.resolve(__dirname, '../src/data/companies_2028.js')).href;

  const { companies: c2027 } = await import(comp2027Path);
  const { companies2028: c2028 } = await import(comp2028Path);

  const records = [
    ...c2027.map(c => mapCompany(c, '2027')),
    ...c2028.map(c => mapCompany(c, '2028'))
  ];

  console.log(`Syncing ${records.length} companies to Supabase (${c2027.length} from 2027, ${c2028.length} from 2028)...`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(records)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Failed to sync to Supabase:', res.status, errText);
    process.exit(1);
  }

  console.log('Successfully synced all companies to Supabase Postgres database!');
}

syncAll().catch(e => {
  console.error('Sync error:', e);
  process.exit(1);
});
