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

// drizzle/migrations.js
var migrations_default = {
  journal: _journal_default,
  migrations: {
    m0000: _0000_icy_sue_storm_default
  }
};
export {
  migrations_default as default
};
