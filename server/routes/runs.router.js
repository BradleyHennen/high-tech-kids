const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/missions', (req, res) => {
    const sqlText = `SELECT "id", "project_id", "name", "description", MAX("project_id") FROM "missions"
GROUP BY "id";`
pool.query( sqlText )
.then ( result => {
    res.send( result.rows )
}).catch ( error => {
    res.sendStatus( 500 );
})
}); // end transaction

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;