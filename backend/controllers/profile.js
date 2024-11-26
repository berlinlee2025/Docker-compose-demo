const { printDateTime } = require('../util/printDateTime');

exports.handleProfileGet = (req, res, db) => {
    printDateTime();

    const { id } = req.params;

    const requestHandlerName = `rootDir/controllers/profile.js handleProfileGet`;
    console.log(`\nJust received an HTTP request for:\n${requestHandlerName}\n`);
    console.log(`\nreq.params.id:\n${id}\n`);

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
        return res.status(422).json({
            success: false,
            state: { code: 422 },
            message: `${requestHandlerName} Invalid id: ${id}`
        });
    }

    db('users').select('*').where('id', '=', userId)
    .then((users) => {
        console.log(`\nusers:`);
        console.log(users);
        return users;
    })
    .then((users) => {

        if (users.length) {
            return res.status(200).json(users[0]);
        } else {
            return res.status(404).json({ 
                status: { code: 404 }, 
                error: 'user NOT found'
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({ 
            status: { code: 500 }, 
            error: `Error getting user: ${err}`}
        );
    });
};

// module.exports = {
//     handleProfileGet: handleProfileGet
// };