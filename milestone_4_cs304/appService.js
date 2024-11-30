const oracledb = require('oracledb');
require('dotenv').config();
const fs = require('fs');
const { connect } = require('http2');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1,
    poolTimeout: 60
};


// initialize connection pool
async function initializeConnectionPool() {
    try {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_DIR })
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM CandidatePartyMembership`);
        return result.rows;
    }).catch((err) => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                name VARCHAR2(20) PRIMARY KEY,
                party VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(name, party, gender) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CandidatePartyMembership (candidateName, partyName, sex) VALUES (:name, :party, :gender)`,
            [name, party, gender],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        return err;
    });
}

async function updateNameDemotable(name, newParty, newGender) {
    return await withOracleDB(async (connection) => {
        let result;
        if(newGender == null){
            result = await connection.execute(
                `UPDATE CandidatePartyMembership SET partyName=:newParty where candidateName=:name`,
                [newParty, name],
                { autoCommit: true }
            );
        }
        else if(newParty == null){
            result = await connection.execute(
                `UPDATE CandidatePartyMembership SET sex=:newGender where candidateName=:name`,
                [newGender, name],
                { autoCommit: true }
            );
        }
        else{
            result = await connection.execute(
                `UPDATE CandidatePartyMembership SET partyName=:newParty where candidateName=:name`,
                [newParty, name],
                { autoCommit: true }
            );
            await connection.execute(
                `UPDATE CandidatePartyMembership SET sex=:newGender where candidateName=:name`,
                [newGender, name],
                { autoCommit: true }
            );
        }
        return result.rowsAffected && result. rowsAffected > 0;
    }).catch((err) => {
        return err;
    });
}

async function deleteFromDemotable(name){
    return await withOracleDB(async(connection) => {
        const result = await connection.execute(
            `DELETE FROM CandidatePartyMembership WHERE candidateName = :name`, 
            [name],
            {autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        return err;
    });
}

async function initializeDB(){
    const file = fs.readFileSync(`./all.sql`, 'utf-8')
    const commands = file.split(';').map(cmd => 
                cmd.trim()).filter(cmd => cmd);
    return await withOracleDB(async (connection) => {
        for (let command of commands){
            try{
                await connection.execute(command);
            }
            catch(err){
                console.log(err);
            }
        }
        try {
            await connection.commit(); 
        } catch (commitErr) {
            console.error('Error committing transaction:', commitErr);
        }
    }).catch((err) => {
        return err;
    });
}

async function projectDB(query){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ${query} FROM SenatorRecommendParliamentaryGroupMembership`);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function joinDB(name){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT cpm.candidateName, cpm.partyName, pp.dateRegistered, pp.numSeatsInParliament
            FROM CandidatePartyMembership cpm
            JOIN PoliticalParty1 pp ON cpm.partyName = pp.partyName
            WHERE pp.partyName = :name`,
            [name]);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function groupByDB(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT M.partyName, COUNT(*) AS numWinners
            FROM CandidatePartyMembership M
            JOIN ElectionWin W ON M.candidateName = W.winner
            GROUP BY M.partyName`);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function havingDB(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT partyName 
            FROM PoliticalParty1    
            GROUP BY partyName
            HAVING MAX(numSeatsInParliament) >= 12`);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function nestedGroupByDB(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT districtName, electionYear, MAX(VoteDifference) AS MaxVoteDifference
            FROM (
                SELECT districtName, electionYear, MAX(VotesObtained) - MIN(VotesObtained) AS VoteDifference
                FROM Elect
                GROUP BY districtName, electionYear
            ) AggregatedVotes
            GROUP BY districtName, electionYear`);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function divisionDB(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT partyName
            FROM PoliticalParty1 P
            WHERE NOT EXISTS (
                (SELECT districtName
                FROM ElectoralDistrict ED
                WHERE province = 'British Columbia')
                MINUS
                (SELECT D.districtName
                FROM Elect E
                JOIN CandidatePartyMembership CPM ON E.candidateName = CPM.candidateName
                JOIN ElectoralDistrict D ON E.districtName = D.districtName
                WHERE P.partyName = CPM.partyName)
            )
`);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}

async function resetDB(){
    return await withOracleDB(async (connection) => {
        await connection.execute(`drop table ElectoralDistrict cascade constraints`);
        await connection.execute("drop table PoliticalParty1 cascade constraints");
        await connection.execute("drop table PoliticalParty2 cascade constraints");
        await connection.execute("drop table CandidatePartyMembership cascade constraints");
        await connection.execute("drop table ElectionWin cascade constraints");
        await connection.execute("drop table Elect cascade constraints");
        await connection.execute("drop table MemberOfParliament cascade constraints");
        await connection.execute("drop table Form1 cascade constraints");
        await connection.execute("drop table Form2 cascade constraints");
        await connection.execute("drop table PrimeMinister cascade constraints");
        await connection.execute("drop table CabinetMember cascade constraints");
        await connection.execute("drop table ParliamentaryGroup cascade constraints");
        await connection.execute("drop table SenatorRecommendParliamentaryGroupMembership cascade constraints");
        await connection.execute("drop table Affiliate cascade constraints");
        await connection.execute("drop table Committee cascade constraints");
        await connection.execute("drop table CommitteeMembership cascade constraints");
        await connection.execute("drop table BillIntroduce1 cascade constraints");
        await connection.execute("drop table BillIntroduce2 cascade constraints");
        await connection.execute("drop table Amend cascade constraints");
        await connection.execute("drop table SenatorVote cascade constraints");
        await connection.execute("drop table MPVote cascade constraints");
        try {
            await connection.commit(); 
        } catch (commitErr) {
            console.error('Error committing transaction:', commitErr);
        }
    }).catch((err) => {
        return err;
    });
}

async function selectionDB(query){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result.rows;
    }).catch((err) => {
        return err;
    });
}
module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    initializeDB,
    projectDB,
    joinDB,
    groupByDB,
    havingDB,
    nestedGroupByDB,
    divisionDB,
    resetDB,
    selectionDB,
    deleteFromDemotable
};