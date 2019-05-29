const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
var moment = require('moment');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT * FROM "projects" WHERE "hidden" = false ORDER BY "id" DESC;`)
    pool.query(sqlText)
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('Something went wrong getting project info', error);
            res.sendStatus(500);
        })
});

router.get('/:id', rejectUnauthenticated, (req, res) => {
    let sqlText = (`SELECT * FROM "projects" WHERE "id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows[0]);
        })
        .catch((error) => {
            console.log('Something went wrong getting project details', error);
            res.sendStatus(500);
        })
});

router.put('/:id', rejectUnauthenticated, async (req, res) => {
    let id = req.params.id;
    // console.log('id', id);
    
    let sqlText = (`UPDATE "projects" SET "hidden" = NOT "hidden" WHERE "id" = $1`)
    pool.query(sqlText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error deleting published status', error);
            res.sendStatus(500);
        })
})

router.put('/publish/:id', (req, res) => {
    let id = req.params.id;
    // console.log('id', id);
    
    let sqlText = (`UPDATE "projects" SET "published" = NOT "published" WHERE "id" = $1`)
    pool.query(sqlText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error updating published status', error);
            res.sendStatus(500);
        })
});

router.put('/name/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.projectName;
    console.log('name', name);
    console.log('id', id);
    
    let sqlText = (`UPDATE "projects" SET "name" = $1 WHERE "id" = $2`)
    pool.query(sqlText, [name, id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error updating published status', error);
            res.sendStatus(500);
        })
});

router.get('/penalties/:id', (req, res) => {
    let sqlText = (`SELECT * FROM "penalties" WHERE "project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('Something went wrong getting penalty info', error);
            res.sendStatus(500);
        })
});

router.delete('/penalties/:id', (req, res) => {
    let sqlText = (`DELETE FROM "penalties" WHERE "id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((response) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('Something went wrong deleting penalty info', error);
            res.sendStatus(500);
        })
})

router.get('/missions/:id', (req, res) => {
    let sqlText = (`SELECT "missions"."id" AS "mission_id", 
                           "missions"."name" AS "mission_name", 
                           "missions"."description", 
                           "goals"."id" AS "goal_id", 
                           "goals"."goal_type_id", 
                           "goals"."name",
                           "goals"."points", 
                           "goals"."how_many_max", 
                           "goals"."how_many_min"
                    FROM "missions"
                    JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                    WHERE "missions"."project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('Something went wrong getting missions and goals', error);
            res.sendStatus(500);
        })
});

router.delete('/missions/:id', rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();
    let id = req.params.id;

    try {
        let goalId = (`SELECT "id" FROM "goals" WHERE "mission_id" = $1 AND "goal_type_id" = '2';`);
        let missionQuery = (`DELETE FROM "missions" WHERE "id" = $1;`);
        let goalQuery = (`DELETE FROM "goals" WHERE "mission_id" = $1;`);
        let eitherOr = (`DELETE FROM "either_or" WHERE "goal_id" = $1;`);
        
    
        await client.query('BEGIN')

        let maybe = await client.query(goalId, [id])
        console.log('maybe', maybe.rows.length);
        if (maybe.rows.length != 0) {
            await client.query(eitherOr, [maybe.rows[0].id])           
        } 
        await client.query(goalQuery, [id]);
        await client.query(missionQuery, [id]);

        await client.query('COMMIT')
        res.sendStatus(201);
      } catch (error) {
        await client.query('ROLLBACK')
        console.log('Error deleting mission', error);
        res.sendStatus(500);
      } finally {
        client.release()
      }
})

router.get('/missions/either-or/:id', (req, res) => {
    let sqlText = (`SELECT 
                        "either_or"."id", 
                        "either_or"."goal_id", 
                        "either_or"."name", 
                        "either_or"."points"
                    FROM "missions"
                    JOIN "goals" ON "goals"."mission_id" = "missions"."id"
                    JOIN "either_or" ON "either_or"."goal_id" = "goals"."id"
                    WHERE "missions"."project_id" = $1;`)
    pool.query(sqlText, [req.params.id])
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('Something went wrong getting either/or goals', error);
            res.sendStatus(500);
        })
});

router.post('/', (req, res) => {
    let newProject = req.body;
    let currentDate = moment().format()
    console.log('req.body post', newProject);

    let sqlText = (`INSERT INTO "projects" ("name", "description", "year", "published", "date_created")
                    VALUES ($1, $2, $3, $4, $5) RETURNING id;`);
    pool.query(sqlText, [newProject.name, newProject.description, newProject.year, newProject.published, currentDate])
        .then((result) => {
            res.send(result.row);
        })
        .catch((error) => {
            console.log('Error adding new project', error);
            res.sendStatus(500);
        })
})

// add penalty
router.post( '/penalty', rejectUnauthenticated, (req, res) => {
    console.log( `req.body:`, req.body );
    let penalty = req.body;

    let sqlText = `INSERT INTO "penalties" ("project_id", "name", "description", "points", "max")
                    VALUES ($1, $2, $3, $4, $5);`;
    pool.query(sqlText, [penalty.project_id, penalty.name, penalty.description, penalty.points, penalty.max] )
        .then( (response) => {
            res.sendStatus(201);
        })
        .catch( (error) => {
            console.log( `Couldn't add penalty.`, error );
            res.sendStatus(500);
        })
})

// get penalty data for edit
router.get( `/penalty/:id`, rejectUnauthenticated, (req, res) => {
    let penalty_id = req.params.id;

    let sqlText = `SELECT * FROM "penalties" WHERE "id" = $1;`;
    pool.query( sqlText, [penalty_id] )
        .then( (result) => {
            res.send(result.rows[0]);
        })
        .catch( (error) => {
            console.log( `Couldn't get penalty data.`, error );
            res.sendStatus(500);
        })
})

// update edited penalty
router.put( `/penalty`, rejectUnauthenticated, (req, res) => {
    let penalty = req.body;

    let sqlText = `UPDATE "penalties" 
                    SET "name" = $1, "description" = $2, 
                    "points" = $3, "max" = $4 
                    WHERE "id" = $5;`;
    pool.query( sqlText, 
        [penalty.name, penalty.description, penalty.points, penalty.max, penalty.penalty_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            console.log( `Couldn't update penatly.`, error );
            res.sendStatus(500);
        })
})

// get goal types for adding/editing missions
router.get( '/goalTypes', rejectUnauthenticated, (req, res) => {
    let sqlText = `SELECT * FROM "goal_types" ORDER BY "id";`;

    pool.query( sqlText )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            console.log( `Couldn't get goal types.`, error );
            res.sendStatus(500);
        })
})

// add mission data
router.post( '/mission', rejectUnauthenticated, async(req, res) => {
    console.log( 'in mission POST...', req.body );
    
    const client = await pool.connect();
    let mission = req.body.mission;
    let goals = mission.goals;
    let eitherOrOptions = req.body.options;
    
    try {
        console.log( 'in mission POST try...' );
        
        await client.query('BEGIN');

        let sqlText1 = `INSERT INTO "missions" ("project_id", "name", "description")
                        VALUES ( $1, $2, $3 ) 
                        RETURNING "id";`;

        const id = await client.query( sqlText1, 
            [mission.project_id, mission.name, mission.description] );

        const missionId = id.rows[0].id;

        for( let goal of goals ){
            console.log( `in da looooop...`, goal );
            
            if(goal.type === '1'){
                console.log( `in Yes/No..` );
                
                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id", "name", "points")
                                VALUES ( $1, $2, $3, $4 );`;
                await client.query( sqlText2, [missionId, goal.type, goal.name, goal.points]);

            } else if(goal.type === '2'){
                console.log( `in E/O..`, goal.goal );

                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id")
                                VALUES ( $1, $2) 
                                RETURNING "id";`;
                const id = await client.query( sqlText2, [missionId, goal.type]);
                const goalId = id.rows[0].id;

                for( let option of eitherOrOptions ){
                    if( goal.goal === option.goal_id ){
                        console.log( `In option loop...`, option );
                        let sqlText3 = `INSERT INTO "either_or" ("goal_id", "name", "points")
                                        VALUES ( $1, $2, $3 );`;
                        
                        await client.query( sqlText3, [ goalId, option.option_name, option.option_points ]);
                    }
                }

            } else if(goal.type === '3'){
                console.log( `in How many..` );
                let sqlText2 = `INSERT INTO "goals" 
                                ("mission_id", "goal_type_id", "name", "points", "how_many_max", "how_many_min")
                                VALUES ( $1, $2, $3, $4, $5, $6 );`;
                await client.query( sqlText2, [missionId, goal.type, goal.name, goal.points, goal.max, goal.min]);
            }
        }

        await client.query('COMMIT');
        res.sendStatus(201);
    } catch(error) {   
        await client.query('ROLLBACK');
        console.log( `Couldn't POST mission, goal data.`, error );
        res.sendStatus(500);
    } finally {
        client.release()
    }
})

// get mission data for edit
router.get( `/mission/:id`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    let mission_id = req.params.id;

    try {
        await client.query('BEGIN');

        let sqlText = `SELECT m."name", m."description", 
                        g."goal_type_id", g."name" AS "goal_name",
                        g."points", g."how_many_max",
                        g."how_many_min",  g."id" AS "goal_id"
                        FROM "missions" AS m
                        JOIN "goals" AS g ON "mission_id" = m."id"
                        WHERE m."id" = $1
                        ORDER BY g."id";`;
        const result = await client.query( sqlText, [mission_id] );
        // console.log( `Result from 1:`, result.rows );

        let optionArray = [];

        for( let row of result.rows ){
            if( row.goal_type_id === 2 ){
                let sqlText2 = `SELECT "id", "goal_id", "name" AS "option_name",
                                "points" AS "option_points"
                                FROM "either_or"
                                WHERE "goal_id" = $1
                                ORDER BY "id";`;
                
                let result2 = await client.query( sqlText2, [row.goal_id] );
                console.log( `Result 2 is:`, result2 );
                
                for( let option of result2.rows ){
                    console.log( `option loop:`, option );
                    optionArray.push(option);
                }
            }
        }
        // console.log( `Result2:`, result2.rows );
        console.log( `optionArray:`, optionArray );

        const allResults = {
            missionGoals: result.rows,
            eitherOrOptions: optionArray,
        }

        await client.query('COMMIT');
        res.send( allResults );
    } catch(error) {   
        await client.query('ROLLBACK');
        console.log( `Couldn't get mission and goal details.`, error );
        res.sendStatus(500);
    } finally {
        client.release()
    }
})

// update mission, goals, and either/or options
router.put( `/mission`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    let mission = req.body;
    let goalList = mission.goals;
    let eitherOrOptions = mission.eitherOrOptions;
    console.log( goalList );

    try {
        console.log( 'in mission PUT try...' );
        
        await client.query('BEGIN');

        let sqlText = `UPDATE "missions"
                        SET "name" = $1, "description" = $2
                        WHERE "id" = $3;`;

        await client.query( sqlText, [ mission.name, mission.description, mission.mission_id ]);
        
        for( let goal of goalList ){
            console.log( `in PUT loop`);
            
            if(goal.goal_type_id === 1){
                console.log( `in PUT if`, goal.goal_id  );
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1,
                                "name" = $2,
                                "points" = $3
                                WHERE "id" = $4;`;
            
                await client.query( sqlText2, [goal.goal_type_id, goal.goal_name, goal.points, goal.goal_id] )

            } else if(goal.goal_type_id === 2){
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1
                                WHERE "id" = $2;`;
            
                await client.query( sqlText2, [goal.goal_type_id, goal.goal_id] );

                for( let option of eitherOrOptions ){
                    console.log( `In option loop...`, option );
                    
                    if( goal.goal_id === option.goal_id ){
                        let sqlText3 = `UPDATE "either_or" 
                                        SET "name" = $1, "points" = $2
                                        WHERE "id" = $3;`;
                        
                        await client.query( sqlText3, [ option.option_name, option.option_points, option.id ]);
                    }
                }

            } else if(goal.goal_type_id === 3){
                let sqlText2 = `UPDATE "goals"
                                SET "goal_type_id" = $1, "name" = $2,
                                "points" = $3, "how_many_max" = $4,
                                "how_many_min" = $5
                                WHERE "id" = $6;`;
            
                await client.query( sqlText2, 
                    [goal.goal_type_id, goal.goal_name, goal.points, 
                    goal.how_many_max, goal.how_many_min, goal.goal_id] );
            }
        }

        await client.query('COMMIT');
        res.sendStatus(201);
    } catch(error) {   
        await client.query('ROLLBACK');
        console.log( `Couldn't POST mission, goal data.`, error );
        res.sendStatus(500);
    } finally {
        client.release()
    }
    
})

router.post( `/goal`, rejectUnauthenticated, async(req, res) => {
    const client = await pool.connect();
    console.log( `in addGoal`, req.body );
    
    const mission_id = req.body.mission_id;

    try {
        await client.query('BEGIN');

        let sqlText = `INSERT INTO "goals" ("mission_id", "goal_type_id")
                        VALUES ($1, 1)
                        RETURNING "id";`;

        const result = await client.query( sqlText, [mission_id] );
        console.log( `Result:`, result.rows );

        await client.query('COMMIT');
        res.send( result.rows );
    } catch(error) {   
        await client.query('ROLLBACK');
        console.log( `Couldn't add goal.`, error );
        res.sendStatus(500);
    } finally {
        client.release()
    }
})

router.post( `/option`, rejectUnauthenticated, (req, res) => {
    const goal_id = req.body.goal_id;
    console.log( `in option POST:`, goal_id );

    let sqlText = `INSERT INTO "either_or" ("goal_id")
                    VALUES ($1)
                    RETURNING "id";`;
    pool.query( sqlText, [goal_id] )
        .then( (result) => {
            res.send(result.rows);
        })
        .catch( (error) => {
            console.log( `Couldn't add option to goal.`, error );
            res.sendStatus(500);
        })
})

router.delete( '/goal/:id', rejectUnauthenticated, (req, res) => {
    console.log( `in delete goal`, req.params.id );
    
    const goal_id = req.params.id;

    let sqlText = `DELETE FROM "goals"
                    WHERE "id" = $1;`;

    pool.query( sqlText, [goal_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            console.log( `Couldn't delete goal.`, error );
            res.sendStatus(500);
        })
})

router.delete( '/option/:id', rejectUnauthenticated, (req, res) => {
    console.log( `in delete option`, req.params.id );
    
    const option_id = req.params.id;

    let sqlText = `DELETE FROM "either_or"
                    WHERE "id" = $1;`;

    pool.query( sqlText, [option_id] )
        .then( (response) => {
            res.sendStatus(200);
        })
        .catch( (error) => {
            console.log( `Couldn't delete option.`, error );
            res.sendStatus(500);
        })
})

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;