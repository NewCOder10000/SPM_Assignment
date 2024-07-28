const sql = require('mssql');
const DBConfig = require("../DBConfig")

class User {
    constructor(ID, Username, Score) {
        this.ID = ID;
        this.Username = Username;
        this.Score = Score;
    }

    static async createUserEntry(NewUserEntry) {
        const connection = await sql.connect(DBConfig);

        const sqlQuery = `INSERT INTO GameUsers (Username, Score) VALUES (@Username, @Score); SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("Username", NewUserEntry.Username);
        request.input("Score", NewUserEntry.Score);

        const result = await request.query(sqlQuery);
        c
        connection.close();

        return this.GetUserById(result.recordset[0].id);
    }

    static async getUserByHighestScore() {
        const connection = await sql.connect(DBConfig);

        const sqlQuery = `SELECT TOP 10 * FROM GameUsers ORDER BY Score DESC`
        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(user => new User(user.ID, user.Username, user.Score));
    }
}

module.exports = User;