// drizzle/local/meta/_journal.json
var _journal_default = {
  version: "5",
  dialect: "sqlite",
  entries: [
    {
      idx: 0,
      version: "5",
      when: 1709733565348,
      tag: "0000_faulty_grim_reaper",
      breakpoints: true
    }
  ]
};

// drizzle/local/0000_faulty_grim_reaper.sql
var _0000_faulty_grim_reaper_default = `CREATE TABLE \`notes\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`title\` text,
	\`content\` text,
	\`owner\` text DEFAULT 'user',
	\`private\` integer DEFAULT false,
	\`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	\`updated_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

// drizzle/local/migrations.js
var migrations_default = {
  journal: _journal_default,
  migrations: {
    m0000: _0000_faulty_grim_reaper_default
  }
};
export {
  migrations_default as default
};
