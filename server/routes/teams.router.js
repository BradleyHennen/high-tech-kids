const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET teams by coach id
 */
router.get('/:id', rejectUnauthenticated, (req, res) => {
    let coachId = req.params.id;

    let sqlText = `SELECT * FROM "teams" WHERE "coach_user_id" = $1`;
    pool.query( sqlText, [coachId] )
        .then( results => {
            res.send(results.rows);
        })
        .catch( (error) => {
            console.log( `Couldn't get teams by coach_user_id.`, req.params );
            res.sendStatus(500);
        })
});

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

router.post('/team-name', rejectUnauthenticated, (req, res) => {
    
})

// PUT to update team_access on toggle clicks
router.put( `/`, rejectUnauthenticated, (req, res) => {
    let team_id = req.body.team_id;
    let access = req.body.permission;
    console.log( `in update access:`, access, team_id );
    
    let sqlText = `UPDATE "teams" SET "team_access" = $1 WHERE "id" = $2;`;
    let newAccess;

    if( access === 'false' ){
        newAccess = true;
        console.log( `newAccess:`, newAccess );

        pool.query( sqlText, [newAccess, team_id] )
            .then((response) => {
                console.log( `it works!` );
                res.sendStatus(200);
            })
            .catch((error) => {
                console.log( `Couldn't update team access.`, error );
                res.sendStatus(500);
            })

    } else if(access === 'true') {
        newAccess = false;
        console.log( `newAccess:`, newAccess );

        pool.query( sqlText, [newAccess, team_id] )
            .then((response) => {
                console.log( `it works!` );
                res.sendStatus(200);
            })
            .catch((error) => {
                console.log( `Couldn't update team access.`, error );
                res.sendStatus(500);
            })
    }
})

module.exports = router;