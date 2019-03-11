'use strict'

module.exports = (app) => {
    const controller = require('./controllers/restController')
   
    app.route('/api/add/message')
    .post(controller.add_message)

    app.route('/api/messages')
    .post(controller.get_messages)

    app.route('/api/delete/:id')
    .delete(controller.delete_message)
    
}