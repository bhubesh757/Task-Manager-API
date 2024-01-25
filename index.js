const express = require('express')
const bodyparser = require('body-parser')
const cronJobs = require('./router/cronsjobs');

const app = express();

require('dotenv').config();
//import the db
require('./db')

const userRouter = require('./router/userRoute')
const taskRouter = require('./router/taskRoute')


const PORT =8000;


app.use(bodyparser.json());

app.use('/users' , userRouter);
app.use('/tasks' , taskRouter);
// app.use(taskRouter)




app.get('/' , (req , res) => {
    res.json({
        message : 'Task manager api is running'
    })
})

app.listen(PORT , () => {
    console.log(`Server is running on  ${PORT}` );
    cronJobs.start();
})


