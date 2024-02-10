// drizzle/meta/_journal.json
var _journal_default = {
  version: "5",
  dialect: "sqlite",
  entries: [
    {
      idx: 0,
      version: "5",
      when: 1707555638311,
      tag: "0000_icy_sue_storm",
      breakpoints: true
    },
    {
      idx: 1,
      version: "5",
      when: 1707580315872,
      tag: "0001_chunky_polaris",
      breakpoints: true
    }
  ]
};

// drizzle/0000_icy_sue_storm.sql
var _0000_icy_sue_storm_default = `CREATE TABLE \`notes\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`title\` text,
	\`content\` text,
	\`timestamp\` text DEFAULT CURRENT_TIMESTAMP,
	\`private\` integer DEFAULT false
);
`;

// drizzle/0001_chunky_polaris.sql
var _0001_chunky_polaris_default = `ALTER TABLE notes ADD \`owner\` text DEFAULT 'user';`;

// drizzle/migrations.js
var migrations_default = {
  journal: _journal_default,
  migrations: {
    m0000: _0000_icy_sue_storm_default,
    m0001: _0001_chunky_polaris_default
  }
};
export {
  migrations_default as default
};
