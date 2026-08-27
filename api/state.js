const { Redis } = require('@upstash/redis');
const redis = Redis.fromEnv();

const STATE_KEY = 'mgc_state';

const DEFAULT_POINT_SCALE = [14,13,12,11,10,9,8,7,6,5,4,3,2,1];

const TEAM_DEFS = [
  { id:"t1",  name:"Let a Naysayer Know",  role:"admin" },
  { id:"t2",  name:"Team Kase",            role:"member", coOwnerCount:2, coOwnerNames:["Flynn","Peb"] },
  { id:"t3",  name:"P Had Twoooo",         role:"member" },
  { id:"t4",  name:"Bu-Bu Bith-Booster",   role:"member" },
  { id:"t5",  name:"Pressed Unt",          role:"admin" },
  { id:"t6",  name:"T-Zo Touchdown",       role:"member" },
  { id:"t7",  name:"NaJihadists",          role:"member" },
  { id:"t8",  name:"Rat Pack",             role:"owner" },
  { id:"t9",  name:"Splurge Garglers",     role:"member" },
  { id:"t10", name:"CTESPN",               role:"admin" },
  { id:"t11", name:"Team Currier",         role:"member" },
  { id:"t12", name:"The Guids",            role:"member" },
  { id:"t13", name:"Team Hall",            role:"member" },
  { id:"t14", name:"Italian Stallions",    role:"admin" },
];

function defaultState() {
  return {
    leagueName: "Mind Goblins Combine",
    teams: TEAM_DEFS.map(t => ({ id: t.id, name: t.name, role: t.role, coOwnerCount: t.coOwnerCount || 1, coOwnerNames: t.coOwnerNames || null })),
    contributor: { id: "chuck", name: "Chuck" },
    spectator: { id: "spectator", name: "Spectator" },
    pinHashes: {},
    pointScale: DEFAULT_POINT_SCALE.slice(),
    raw: {},
    scores: {},
    teamAssignments: {},
    matchResults: {},
    cancelledEvents: [],
    quiz: {
      questions: Array.from({ length: 15 }, () => ({ q: "", a: "" })),
      bonusQ: "", bonusA: null,
      released: false, scoresReleased: false,
      started: {},
      submissions: {}
    },
    meta: { updatedAt: 0, updatedBy: "" }
  };
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      let state = await redis.get(STATE_KEY);
      if (!state) {
        state = defaultState();
        state.meta.updatedAt = Date.now();
        await redis.set(STATE_KEY, state);
      }
      res.status(200).json(state);
      return;
    }
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { res.status(400).json({ error: 'invalid json' }); return; } }
      if (!body || typeof body !== 'object') { res.status(400).json({ error: 'invalid body' }); return; }
      await redis.set(STATE_KEY, body);
      res.status(200).json({ ok: true });
      return;
    }
    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
};
