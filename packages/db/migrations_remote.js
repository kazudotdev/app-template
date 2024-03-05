// drizzle/remote/meta/_journal.json
var _journal_default = {
  version: "5",
  dialect: "sqlite",
  entries: [
    {
      idx: 0,
      version: "5",
      when: 1709733640771,
      tag: "0000_uneven_mysterio",
      breakpoints: true
    }
  ]
};

// drizzle/remote/0000_uneven_mysterio.sql
var _0000_uneven_mysterio_default = `CREATE TABLE \`groups\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	\`updated_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE \`users\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`email\` text NOT NULL,
	\`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	\`updated_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE \`users_to_groups\` (
	\`user_id\` text NOT NULL,
	\`group_id\` text NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`groups_id_unique\` ON \`groups\` (\`id\`);--> statement-breakpoint
CREATE UNIQUE INDEX \`users_id_unique\` ON \`users\` (\`id\`);--> statement-breakpoint
CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);`;

// drizzle/remote/migrations.js
var migrations_default = {
  journal: _journal_default,
  migrations: {
    m0000: _0000_uneven_mysterio_default
  }
};
export {
  migrations_default as default
};
