const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment');

/**
 * GET to get all missions for current project
 */

router.get('/missions', async (req, res) => {
    const client = await pool.connect();
    try {
        let sqlText1 = `SELECT "id" FROM "projects"
                        WHERE "published"= TRUE
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                        "id", 
                        "project_id", 
                        "name", 
                        "description"
                        FROM "missions"
                        WHERE "project_id"=$1
                        GROUP BY "id";`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1)
        const projectId = runsIdResponse.rows[0].id;
        const missionsResponse = await client.query(sqlText2, [projectId])
        await client.query('COMMIT')
        // console.log(`response in get missions for run request`, missionsResponse.rows);
        // console.log(`projectId in selected missions get`, projectId);
        res.send(missionsResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        console.log(`error getting your selected missions details`, error)
        res.sendStatus(500);
    }
    finally {
        client.release();
    }
});


//POST to post all rundetails for logged in team
router.post('/saveDetails', async (req, res) => {
    const client = await pool.connect();
    console.log(`req.body in saveDetails`, req.body);
    let teamId;
    let runDetails = req.body.runDetails.newRun;
    let runTeam = req.body.runDetails.runTeam;
    let selectedMissions = req.body.runDetails.newRun.selectedMissions;
    let currentDate = moment().format();

    if (req.user.security_clearance === 2) {
        try{
            teamId = req.body.id.teamId;
            let sqlText1 = `INSERT INTO "runs" (team_id, name, date, driver, assistant, score_keeper)
                            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`
            let sqlText2 = `INSERT INTO "selected_missions" (run_id, mission_id)
                            VALUES ($1, $2) RETURNING id`
            let sqlText3 = `SELECT * FROM "goals"`
            let selectedMissionsIdArr = [];
            await client.query('BEGIN')
            
            const runsInsertResponse = await client.query(sqlText1, [teamId, runDetails.runName, currentDate, runTeam.driverId, runTeam.assistantId, runTeam.scorekeeperId])
            const runId = runsInsertResponse.rows[0].id;
            for (mission of selectedMissions) {
                if(mission.selected === true){
                    const selectedMissionsInsertResponse = await client.query(sqlText2, [runId, mission.id])
                    selectedMissionsIdArr.push(selectedMissionsInsertResponse);
                }
            }
            console.log('selectedMissionsIdArr', selectedMissionsIdArr);
            
            await client.query('COMMIT')
            res.send(runId);
        }
        catch ( error ) {
            await client.query('ROLLBACK')
            console.log(`error posting your run detials`, error)
            res.sendStatus(500);
        }
        finally{
            client.release();
        }

    }
    else if (req.user.security_clearance === 4) {
        console.log(`in save run details`, req.user.id);
        try {
            teamId = req.user.id;
            let sqlText0 = `SELECT "id" FROM "teams"
                            WHERE "team_user_id"=$1;`;
            let sqlText1 = `INSERT INTO "runs" (team_id, name, date, driver, assistant, score_keeper)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            RETURNING id;`
            let sqlText2 = `INSERT INTO "selected_missions" (run_id, mission_id)
                            VALUES ($1, $2)
                            RETURNING id;`;
            let selectedMissionsIdArr = [];

            await client.query('BEGIN')
            const idResponse = await client.query(sqlText0, [teamId])
            const runsInsertResponse = await client.query(sqlText1, [idResponse.rows[0].id, runDetails.runName, currentDate, runTeam.driverId, runTeam.assistantId, runTeam.scorekeeperId])
            const runId = runsInsertResponse.rows[0].id;
            for (mission of selectedMissions) {
                if (mission.selected === true) {
                    const selectedMissionsInsertResponse = await client.query(sqlText2, [runId, mission.id]);
                    selectedMissionsIdArr.push(selectedMissionsInsertResponse.rows);

                }
            }
            console.log('selectedMissionsIdArr', selectedMissionsIdArr);

            await client.query('COMMIT')
            res.sendStatus(201);
        }
        catch (error) {
            await client.query('ROLLBACK')
            console.log(`error posting your run detials`, error)
            res.sendStatus(500);
        }
        finally {
            client.release();
        }
    }
    else {
        res.sendStatus(500);
    }
    
});

// /**
//  * GET to get details for yes/no and how many goals for latest run for logged in team
//  */

router.get('/selectedMissions', async (req, res) => {
    const client = await pool.connect();
    // console.log(`in getSelectedMissions`, req.user);
    let teamId = req.user.id;
        try {
            let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                            JOIN "teams" ON "teams"."id" = "runs"."team_id"
                            WHERE "team_user_id" = $1
                            ORDER BY "id" DESC LIMIT 1;`
            let sqlText2 = `SELECT
                            "run_id",
                            "selected_missions"."mission_id",
                            "missions"."name" AS "mission_name",
                            "missions"."description" AS "mission_description", 
                            "goals"."id" AS "goal_id",
                            "goals"."goal_type_id", 
                            "goals"."name" AS "goal_name", 
                            "goals"."points" AS "goal_points", 
                            "goals"."how_many_max", 
                            "goals"."how_many_min",
                            "goal_types"."type" AS "goal_type"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "goal_types" ON "goal_types"."id" = "goals"."goal_type_id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`

            await client.query('BEGIN')
            const runsIdResponse = await client.query(sqlText1, [teamId])
            const runId = runsIdResponse.rows[0].id;
            const selectedMissionsGetResponse = await client.query(sqlText2, [runId])
            await client.query('COMMIT')
            // console.log(`response in get selected missions request`, selectedMissionsGetResponse.rows);
            const runInfo = {
                id: runsIdResponse.rows[0].id, runName: runsIdResponse.rows[0].name, runDetails: selectedMissionsGetResponse.rows };
            // console.log(`runInfo in selected missions get`, runInfo);
            res.send(runInfo);
        }
        catch (error) {
            await client.query('ROLLBACK')
            console.log(`error getting your selected missions details`, error)
            res.sendStatus(500);
        }
        finally {
            client.release();
        }

});

// /**
//  * GET to get details for either/or goals for latest run for logged in team
//  */

router.get('/selectedMissions/eitherOr', async (req, res) => {
    const client = await pool.connect();
    // console.log(`in getSelectedMissions`, req.user);
    let teamId = req.user.id;
    try {
        let sqlText1 = `SELECT "runs"."id", "runs"."name" FROM "runs"
                        JOIN "teams" ON "teams"."id" = "runs"."team_id"
                        WHERE "team_user_id" = $1
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                            "either_or"."goal_id" AS "either_or_goal_id",
                            "either_or"."id" AS "either_or_id",
                            "either_or"."name" AS "either_or_name",
                            "either_or"."points" AS "either_or_points"
                            FROM "selected_missions"
                            JOIN "missions" ON "selected_missions"."mission_id" = "missions"."id"
                            JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                            JOIN "either_or" ON "goal_id" = "goals"."id"
                            WHERE "selected_missions"."run_id" = $1
                            ORDER BY "selected_missions"."mission_id";`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1, [teamId])
        const runId = runsIdResponse.rows[0].id;
        const eitherOrGetResponse = await client.query(sqlText2, [runId])
        await client.query('COMMIT')
        // console.log(`response in get selected missions request`, eitherOrGetResponse.rows);
        // console.log(`runInfo in selected missions get`, runInfo);
        res.send(eitherOrGetResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        console.log(`error getting your selected missions details`, error)
        res.sendStatus(500);
    }
    finally {
        client.release();
    }

});

// /**
//  * GET for all penalties for current project
//  */

router.get('/penalties', async (req, res) => {
    const client = await pool.connect();
    try {
        let sqlText1 = `SELECT "id" FROM "projects"
                        WHERE "published"= TRUE
                        ORDER BY "id" DESC LIMIT 1;`
        let sqlText2 = `SELECT
                        "penalties"."id",
                        "penalties"."name",
                        "penalties"."points",
                        "penalties"."max"
                        FROM "penalties"
                        JOIN "projects" ON "projects"."id" = "penalties"."project_id"
                        WHERE "projects"."id"=$1;`
        await client.query('BEGIN')
        const runsIdResponse = await client.query(sqlText1)
        const projectId = runsIdResponse.rows[0].id;
        const penaltiesResponse = await client.query(sqlText2, [projectId])
        await client.query('COMMIT')
        // console.log(`response in get penalties for run request`, penaltiesResponse.rows);
        // console.log(`runInfo in selected missions get`, projectId);
        res.send(penaltiesResponse.rows);
    }
    catch (error) {
        await client.query('ROLLBACK')
        console.log(`error getting your selected missions details`, error)
        res.sendStatus(500);
    }
    finally {
        client.release();
    }
});

//GET runs for coach based on url query string
router.get('/coach/:id', (req, res) => {
    let id = req.params.id;

    const sqlText = `
        SELECT "runs"."id", "runs"."name", COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end), "runs"."score", "runs"."penalties" FROM "runs"
        JOIN "selected_missions" ON "run_id" = "runs"."id"
        JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
        WHERE "team_id" = $1
        GROUP BY "runs"."id";
    `;

    pool.query( sqlText, [id] )
        .then ( result => {
            // result should be an array of objects with run information
            // run id, run name, goals completed count, run score
            res.send( result.rows );
        }).catch ( error => {
            res.sendStatus( 500 );
        });
});


router.get( '/runHistoryDetails/:id', rejectUnauthenticated, (req, res) => {
    const runId = req.params.id;
    console.log( `runId:`, runId );
    
    let sqlText = `SELECT r."id", r."name", r."date", r."score", r."penalties", r."notes",
                    (CASE WHEN r."driver" = t."id" THEN t."name" END) AS "driver", 
                    (CASE WHEN r."assistant" = t1."id" THEN t1."name" END) AS "assistant", 
                    (CASE WHEN r."score_keeper" = t2."id" THEN t2."name" END) AS "score_keeper",
                    COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end)
                    FROM "runs" AS r
                    LEFT JOIN "team_members" AS t ON t."id" = r."driver"
                    JOIN "team_members" AS t1 ON t1."id" = r."assistant"
                    JOIN "team_members" AS t2 ON t2."id" = r."score_keeper"
                    JOIN "selected_missions" ON "run_id" = r."id"
                    JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
                    WHERE r."id" = $1
                    GROUP BY r."id", t."id", t1."id", t2."id"`;

    pool.query( sqlText, [runId] )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            console.log( `Couldn't get run details by id.`, error );
            res.sendStatus(500);
        })
} )

router.put( `/summary/:id`, rejectUnauthenticated, (req, res) => {
    console.log( `HERE!` );
    
    const runId = req.params.id;
    const runNotes = req.body.notes;
    console.log( `Notes:`, runNotes );

    let sqlText = `UPDATE "runs" 
                    SET "notes" = $1
                    WHERE "id" = $2;`;

    pool.query( sqlText, [runNotes, runId] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            console.log( `Couldn't update run summary notes.`, error );
            res.sendStatus(500);
        })
})

/**
 * GET runs for team based on user id
 */
router.get('/team', (req, res) => {

    let id = req.user.id;
    console.log('user id', id);
    
    const sqlText = `
            SELECT "runs"."id", "runs"."name", COUNT(CASE WHEN "goals_per_run"."is_completed" THEN 1 end), "runs"."score", "runs"."penalties"
            FROM "runs"
            JOIN "selected_missions" ON "run_id" = "runs"."id"
            JOIN "goals_per_run" ON "selected_missions_id" = "selected_missions"."id"
            JOIN "teams" ON "teams"."id" = "runs"."team_id"
            WHERE "teams"."team_user_id" = $1
            GROUP BY "runs"."id";
        `;

    pool.query( sqlText, [id] )
        .then ( result => {
            // result should be an array of objects with run information
            // run id, run name, goals completed count, run score
            console.log('result', result.rows);
            
            res.send( result.rows );
        }).catch ( error => {
            res.sendStatus( 500 );
        });
});

module.exports = router;