const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth')
const Task = require('../models/task')
const SubTask = require('../models/subtask')
const cron = require('node-cron');
const twilio = require('twilio');
require('dotenv').config();

// set up the twilio
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio.Twilio("AC4dd11fd13a1840ffdba8d922214692a4", "9f4edd3e31a77236cb4538c1f16b37e8");



router.get('/test' , auth , (req , res) => {
    res.send('Task routes are working properly');
    user : req.user;
})


//Openinapp 

// Lets create a tasks
router.post('/' , auth , async(req , res) => {
    try {
        const { title, description, due_date , priority  } = req.body;
        const userId = req.user._id; 

        const newTask = new Task({
            title,
            description,
            due_date,
            priority,
            createdBy: userId,
        });

        await newTask.save();

        res.status(201).json({ task: newTask, message: 'Task created successfully' });
    }
    catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Create Subtask
router.post('/:taskId/subtasks', auth, async (req, res) => {
    try {
      const { status } = req.body;
      const { taskId } = req.params;
  
      const subtask = new SubTask({ task_id: taskId, status });
      await subtask.save();
  
      // Update the main task's subtasks array
      await Task.findByIdAndUpdate(taskId, { $push: { subtasks: subtask._id } });
  
      res.status(201).json({ subtask, message: 'Subtask created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// Read

// get user tasks

router.get('/', auth, async (req, res) => {
    try {
        const { due_date } = req.query;
        const createdBy = req.user._id;

        //  filters (priority, due_date)
        const tasks = await Task.find({ createdBy, due_date }).exec();

        res.status(200).json({tasks, count: tasks.length, message: "Tasks Fetched Successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/', auth, async (req, res) => {
//     try{
//         const tasks = await Task.find({
//             createdBy: req.user._id
//         })
//         res.status(200).json({tasks, count: tasks.length, message: "Tasks Fetched Successfully"});
//     }
//     catch(err){
//         res.status(500).send({error: err});
//     }
// });


// by id 

router.get('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOne({
            _id: taskid,
            createdBy: req.user._id
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({task, message: "Task Fetched Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})


// get a subtask 

// Get All User Subtasks for a Task
router.get('/:taskId/subtasks', auth, async (req, res) => {
    try {
      const { taskId } = req.params;
  
      // Implement filtering logic if needed...
  
      const subtasks = new SubTask({ task_id: taskId });
  
      res.status(200).json({ subtasks, count: subtasks.length, message: 'Subtasks Fetched Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //verified working


// Update a task


router.put('/:task_id', auth, async (req, res) => {
    try {
        const { due_date, status } = req.body;
        const task_id = req.params.task_id;

        // Check if the task exists
        const task = await Task.findById(task_id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update task properties
        if (due_date) {
            task.due_date = due_date;
        }

        if (status) {
            task.status = status;
        }

        // Save the updated task
        await task.save();

        res.status(200).json({ task, message: 'Task updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update Subtask
router.patch('/:taskId/subtasks/:subtaskId', auth, async (req, res) => {
    try {
      const { status } = req.body;
      const { taskId, subtaskId } = req.params;
  
      res.status(200).json({ message: 'Subtask updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



// delete a task


router.delete('/:task_id', auth, async (req, res) => {
    try {
        const task_id = req.params.task_id;

        const task = await Task.findById(task_id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.deletedAt = new Date();
        await task.save();

        res.status(200).json({ message: 'Task soft deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:taskId/subtasks/:subtaskId', auth, async (req, res) => {
    try {
      const { subtaskId } = req.params;
  
      // Soft delete subtask...
  
      res.status(200).json({ message: 'Subtask deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


router.post('/voice-call', async (req, res) => {
    try {
        const { to, from, url } = req.body;

        // Make Twilio voice call
        const call = await twilioClient.calls.create({
            to,
            from,
            url,
        });

        res.status(200).json({ callSid: call.sid, message: 'Voice call initiated successfully.' });
    } catch (error) {
        console.error('Error making voice call:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;