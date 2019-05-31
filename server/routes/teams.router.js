const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const encryptLib = require('../modules/encryption');

/**
 * GET team members by team id
 */
router.get('/members', rejectUnauthenticated, (req, res) => {
    console.log(`team members user id`, req.user);
    let sqlText = `SELECT "team_members"."id" AS "member_id", "team_members"."team_id", "team_members"."name", "users"."id" AS "user_id" 
                   FROM "team_members"
                   LEFT JOIN "teams" ON "team_members"."team_id" = "teams"."id"
                   LEFT JOIN "users" ON "teams"."team_user_id" = "users"."id"
                   WHERE "users"."id"=$1
                   ORDER BY "team_members"."id";`;
    pool.query(sqlText, [req.user.id])
        .then(results => {
            // console.log(`result.rows in team member get`, results.rows);
            
            res.send(results.rows);
        })
        .catch((error) => {
            console.log(`Couldn't get team members for logged in user.`, error);
            res.sendStatus(500);
        })
});


/**
 * GET team members by team id for coach
 */
router.get('/members/:id', rejectUnauthenticated, (req, res) => {
    console.log(`team members user id`, req.params.id);
    let sqlText = `SELECT "team_members"."id" AS "member_id", "team_members"."team_id", "team_members"."name"
                   FROM "team_members"
                   LEFT JOIN "teams" ON "team_members"."team_id" = "teams"."id"
                   WHERE "teams"."id"=$1
                   AND "hidden" = false
                   ORDER BY "team_members"."id";`;
    pool.query(sqlText, [req.params.id])
        .then(results => {
            console.log(`result.rows in team member get`, results.rows);

            res.send(results.rows);
        })
        .catch((error) => {
            console.log(`Couldn't get team members for logged in user.`, error);
            res.sendStatus(500);
        })
});

//Get info about the current team

router.get('/team-info/:id', rejectUnauthenticated, (req, res) => {
    let teamId = req.params.id
    console.log('team id is', teamId);
    
    let sqlText = `SELECT * FROM teams WHERE "id" = $1`
    pool.query (sqlText, [teamId])
    .then( results => {
        console.log('results are', results.rows);
        
        res.send(results.rows);
    })
    .catch( (error) => {
        console.log( `Couldn't get team info.`);
        res.sendStatus(500);
    })
})

/**
 * GET teams by coach id
 */
router.get('/:id', rejectUnauthenticated, (req, res) => {
    let coachId = req.params.id;
    let sqlText = `SELECT t."id", t."coach_user_id", t."team_user_id",
                    t."name", t."team_number", u."security_clearance" AS "team_access"
                    FROM "teams" AS t
                    JOIN "users" AS u ON u."id" = t."team_user_id"
                    WHERE "coach_user_id" = $1`;
    pool.query( sqlText, [coachId] )
        .then( results => {
            res.send(results.rows);
        })
        .catch( (error) => {
            console.log( `Couldn't get teams by coach_user_id.`, error );
            res.sendStatus(500);
        })
});


//Gets Team ID
router.get(`/team-id/:id`, rejectUnauthenticated, (req, res) => {
    let teamNumber = req.params.id;     
    let sqlText = `SELECT "id" FROM "teams" WHERE "team_number" = $1`
    pool.query( sqlText, [teamNumber])
    .then( results => {
        res.send(results.rows);
    })
    .catch( (error) => {
        console.log( `Couldn't get team id.`, error );
        res.sendStatus(500);
    })
});
   
//Create new team member
router.post(`/team-member`, (req, res) => {
     let name = req.body.newTeamMember;
     let team_id = req.body.teamId;
     let hidden = false
     let sqlText = `INSERT INTO team_members ("team_id", "name", "hidden") VALUES ($1, $2, $3)`
     pool.query(sqlText, [team_id, name, hidden])
     .then((result) => {
         res.sendStatus(200);
     })
     .catch((error) => {
         console.log('Error adding new project', error);
         res.sendStatus(500);
     })
})

//Create new Team, team user, and coach team member
router.post(`/team-name`, rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();
    let team_name = req.body.teamName 
    let team_number = req.body.teamNumber
    let coach_user_id = req.body.coach_user_id
    let security_clearance = 3
    let password = encryptLib.encryptPassword(req.body.password);
    let hidden = false
    let coach = 'coach'
    try{
        await client.query('BEGIN');
        //This will create the team in the user table
        let sqlText1 = `INSERT INTO users ("username", "password", "security_clearance") VALUES ($1, $2, $3) RETURNING id`;
        //This will create the team in the teams table
        let sqlText2 = `INSERT INTO teams ("name", "team_number", "coach_user_id", "team_user_id") VALUES ($1, $2, $3, $4) RETURNING id`;
        let sqlText3 = `INSERT INTO team_members ("team_id", "name", "hidden") VALUES ($1, $2, $3)`
        const idInsert = await client.query( sqlText1, [team_name, password, security_clearance]);
        //This will grab the id from the just-created user table row and allow us to insert it into the team table
        id = idInsert.rows[0].id
        const teamIdInsert = await client.query( sqlText2, [team_name, team_number, coach_user_id, id]);
        teamId = teamIdInsert.rows[0].id
        await client.query( sqlText3, [teamId, coach, hidden]);
        await client.query('COMMIT');
        res.sendStatus(200);
    }
    catch (error) {
    await client.query('ROLLBACK');
    console.log(`Error making database query`, error);
    res.sendStatus(500);
  } finally {
    client.release()
  }
})

//PUT to hide the team member
router.put(`/hide-team-member`, rejectUnauthenticated, (req, res) => {
    console.log('req body', req.body)
    let id = req.body.member_id
    let hidden = true
    console.log('id is', id);
    
    let sqlText = `UPDATE "team_members" SET "hidden" = $1 WHERE "id" = $2`
    pool.query( sqlText, [hidden, id])
        .then((response) => {
            res.sendStatus(200)
        })
        .catch((error) => {
            console.log('could not hide team member', error)
            alert('Could not hide team member')
        })
})

//PUT to update team member name
router.put(`/edit-team-member`, rejectUnauthenticated, (req, res) => {
    let team_id = req.body.id
    let name = req.body.teamMemberName
    let sqlText = `UPDATE "team_members" SET "name" = $1 WHERE "id" = $2`;
    pool.query( sqlText, [name, team_id] )
            .then((response) => {
                res.sendStatus(200);
            })
            .catch((error) => {
                console.log( `Couldn't update team member.`, error );
                res.sendStatus(500);
            })
})

// PUT to update team_access on toggle clicks
router.put( `/teamAccess`, rejectUnauthenticated, (req, res) => {
    let team_id = req.body.team_id;
    let access = req.body.permission;
    console.log( `in update access:`, access, team_id );
    
    let sqlText = `UPDATE "users" SET "security_clearance" = $1 WHERE "id" = $2;`;
    let newAccess;

    if( access === 4 ){
        newAccess = 4;
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

    } else if(access === 3) {
        newAccess = 3;
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
