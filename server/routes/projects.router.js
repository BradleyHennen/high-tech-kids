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

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;