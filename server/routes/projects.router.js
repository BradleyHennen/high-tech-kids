const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
var moment = require('moment');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    let sqlText = (`SELECT * FROM "projects" ORDER BY "id" DESC;`)
    pool.query(sqlText)
        .then((results) => {
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('Something went wrong getting project info', error);
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