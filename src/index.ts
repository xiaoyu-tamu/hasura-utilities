/* eslint-disable @typescript-eslint/camelcase */
import { PostgresExplorer } from "@ts-schema-generator/explorer";
import { Table, TableDefinition, View, ViewDefinition } from "@ts-schema-generator/types";
import { camelCase, pascalCase } from "change-case";
import { join } from "path";
import { plural } from "pluralize";
import { request } from "./request";

interface Configuration {
  tables?: Table[];
  views?: View[];
}

async function generateHasuraApi(tableDefinition: TableDefinition | ViewDefinition): Promise<void> {
  /**
   * generate column names
   */
  await request({
    type: "set_table_custom_fields",
    version: 2,
    args: {
      table: {
        name: tableDefinition.name,
        schema: tableDefinition.schema,
      },
      custom_root_fields: {
        select: camelCase(plural(tableDefinition.name)),
        select_by_pk: camelCase(tableDefinition.name),
        select_aggregate: `${camelCase(plural(tableDefinition.name))}Aggregate`,
        insert: `create${pascalCase(plural(tableDefinition.name))}`,
        update: `update${pascalCase(plural(tableDefinition.name))}`,
        delete: `delete${pascalCase(plural(tableDefinition.name))}`,
      },
      custom_column_names: tableDefinition.columns.reduce<Record<string, string>>((acc, curr) => {
        if (!curr.name.includes("_")) return acc;
        acc[curr.name] = camelCase(curr.name);
        return acc;
      }, {}),
    },
  }).then(console.log);
}

main();

export async function main(): Promise<void> {
  const uri = process.env.DATABASE_URI;
  if (!uri) throw new Error(`DATABASE_URI is required`);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: Configuration = require(join(process.cwd(), "hasura.config.js"));

  const explorer = new PostgresExplorer(uri);

  for (const tableDefinition of await explorer.getTableDefinitions(config.tables)) {
    if (config.tables) await generateHasuraApi(tableDefinition);
  }

  for (const viewDefinition of await explorer.getViewDefinitions(config.views)) {
    if (config.views) await generateHasuraApi(viewDefinition);
  }

  await explorer.pool.end();
}
