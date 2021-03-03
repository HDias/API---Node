import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
    // ormconfig.json
    const defaultOptions = await getConnectionOptions();
    
    // Altera o valor database
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === "test" ? "./src/database/database.test.sqlite" : defaultOptions.database
        })
    );
}