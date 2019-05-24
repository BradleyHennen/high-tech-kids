const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const encryptLib = require('../modules/encryption');

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


router.post(`/team-name`, rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();
    let team_name = req.body.teamName 
    let team_number = req.body.teamNumber
    let coach_user_id = req.body.coach_user_id
    let security_clearance = 3
    let password = encryptLib.encryptPassword(req.body.password);
    let team_access = false
    let hidden = false
    let coach = 'coach'
    try{
        await client.query('BEGIN');
        //This will create the team in the user table
        let sqlText1 = `INSERT INTO users ("username", "password", "security_clearance") VALUES ($1, $2, $3) RETURNING id`;
        //This will create the team in the teams table
        let sqlText2 = `INSERT INTO teams ("name", "team_number", "coach_user_id", "team_user_id", "team_access") VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        let sqlText3 = `INSERT INTO team_members ("team_id", "name", "hidden") VALUES ($1, $2, $3)`
        const idInsert = await client.query( sqlText1, [team_name, password, security_clearance]);
        //This will grab the id from the just-created user table row and allow us to insert it into the team table
        id = idInsert.rows[0].id
        
        const teamIdInsert = await client.query( sqlText2, [team_name, team_number, coach_user_id, id, team_access]);
        teamId = teamIdInsert.rows[0].id
        console.log(teamId);
        
        await client.query( sqlText3, [teamId, coach, hidden]);

        await client.query('COMMIT');
        res.sendStatus(200);
    }catch (error) {
    await client.query('ROLLBACK');
    console.log(`Error making database query`, error);
    res.sendStatus(500);
  } finally {
    client.release()
  }
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
