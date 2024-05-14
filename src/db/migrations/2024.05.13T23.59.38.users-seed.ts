import { Migration } from "../scripts/dbMigrate";
import { faker } from  "@faker-js/faker";

export type User = {
  name: string;
  password: string;
  email: string;
  age: bigint;
  role: string;
};


export function generateUser(): User {
  const name = faker.internet.userName();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const role = faker.helpers.arrayElement(["user", "admin"]);
  const age = faker.number.bigInt({ min: 1n, max: 100n });

  return {
    name,
    password,
    email,
    role,
    age,
  };
}

export const up: Migration = async (params) => {
  const users: User[] = [];
  for (let i = 0; i < 5; i++) {
    users.push(generateUser());
  }

  const values = users
    .map(
      (user) =>
        `('${user.name}', '${user.password}', '${user.email}', '${user.role}', '${user.age}')`
    )
    .join(", ");
  const sqlQuery = `INSERT INTO Users (name, password, email, role, age) VALUES ${values};`;
  console.log(sqlQuery);
  return await params.context.query(sqlQuery);
};

export const down: Migration = async (params) => {
  return params.context.query(`DELETE FROM users;`);
};

