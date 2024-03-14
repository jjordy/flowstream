import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replace("_", "");
}

export async function createDataRepository(name = "thing") {
  const FILE_PATH = path.join(
    __dirname,
    "..",
    "data-repositories",
    `${name}.ts`,
  );

  const fileContent = `import { ${capitalizeFirstLetter(
    name,
  )} } from "kysely-codegen";
  import { baseOperations } from "../base";

  export const PUBLIC_FIELDS = [

  ];

  const { findById, updateItem, createItem, deleteItem } = baseOperations<${capitalizeFirstLetter(
    name,
  )}>(
        "${name}",
    PUBLIC_FIELDS,
  );

  export const actions = {
    find${capitalizeFirstLetter(name)}ById: findById,
    update${capitalizeFirstLetter(name)}: updateItem,
    create${capitalizeFirstLetter(name)}: createItem,
    delete${capitalizeFirstLetter(name)}: deleteItem,
  };`;
  try {
    console.log(`Creating Data Repository: ${FILE_PATH}`);
    await fs.writeFile(FILE_PATH, fileContent);
  } catch (err) {
    console.log(err);
  }
}
