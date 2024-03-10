// drizzle/meta/_journal.json
var _journal_default = {
  version: "5",
  dialect: "sqlite",
  entries: [
    {
      idx: 0,
      version: "5",
      when: 1710064334297,
      tag: "0000_illegal_mattie_franklin",
      breakpoints: true
    }
  ]
};

// drizzle/0000_illegal_mattie_franklin.sql
var _0000_illegal_mattie_franklin_default = `CREATE TABLE \`notes\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`title\` text,
	\`content\` text,
	\`owner\` text DEFAULT 'user',
	\`private\` integer DEFAULT false,
	\`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	\`updated_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

// drizzle/migrations.js
var migrations_default = {
  journal: _journal_default,
  migrations: {
    m0000: _0000_illegal_mattie_franklin_default
  }
};
export {
  migrations_default as default
};
