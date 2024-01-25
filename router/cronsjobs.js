// const cron = require('node-cron');
// const Task = require('../models/task');
// const User = require('../models/user');
// const twilio = require('twilio');
// require('dotenv').config();
// // Setup Twilio
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = require('twilio')(accountSid, authToken);

// // 1. Cron logic for changing priority of task based on due_date
// cron.schedule('0 0 * * *', async () => {
//     try {
//         const today = new Date();

//         // Update task priorities based on due_date
//         await Task.updateMany(
//             { due_date: { $lt: today }, priority: { $lt: 3 } },
//             { $inc: { priority: 1 } }
//         );

//         console.log('Task priorities updated successfully.');
//     } catch (error) {
//         console.error('Error updating task priorities:', error);
//     }
// });

// // 2. Cron logic for voice calling using twilio
// cron.schedule('0 * * * *', async () => {
//     try {
//         // Get tasks whose due_date has passed and status is "TODO"
//         const overdueTasks = await Task.find({ due_date: { $lt: new Date() }, status: 'TODO' })
//             .populate('createdBy', 'priority phone_number')
//             .sort({ 'createdBy.priority': 'asc' })
//             .limit(1);

//         if (overdueTasks.length > 0) {
//             const userPriority = overdueTasks[0].createdBy.priority;
//             const userPhoneNumber = overdueTasks[0].createdBy.phone_number;

//             // Make Twilio voice call to the user
//             await twilioClient.calls.create({
//                 to: userPhoneNumber,
//                 from: '+16592177075',
//                 url: "http://demo.twilio.com/docs/voice.xml", // Provide a URL for handling the voice call
//                 method: 'GET',
//             });

//             console.log(`Voice call made to user with priority ${userPriority}.`);
//         }
//     } catch (error) {
//         console.error('Error making voice call:', error);
//     }
// });



const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/user');
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio.Twilio("AC4dd11fd13a1840ffdba8d922214692a4", "9f4edd3e31a77236cb4538c1f16b37e8");

const cronJobs = {
  start: () => {
cron.schedule('*/1 * * * *', async () => {
  try {
      const today = new Date();

      await Task.updateMany(
          { due_date: { $lt: today }, priority: { $lt: 3 } },
          { $inc: { priority: 1 } }
      );

      console.log('Task priorities updated successfully.');
  } catch (error) {
      console.error('Error updating task priorities:', error);
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
  
      const overdueTasks = await Task.find({ due_date: { $lt: new Date() }, status: 'TODO' })
          .populate('createdBy', 'priority phone_number')
          .sort({ 'createdBy.priority': 'asc' })
          .limit(1);

      if (overdueTasks.length > 0) {
          const userPriority = overdueTasks[0].createdBy.priority;
          const userPhoneNumber = overdueTasks[0].createdBy.phone_number;

          // Make Twilio voice call to the user
          await twilioClient.calls.create({
              to: '+918072782437',
              from: '+16592177075',
              url: "http://demo.twilio.com/docs/voice.xml", // Provide a URL for handling the voice call
              method: 'GET',
          });

          console.log(`Voice call made to user with priority ${userPriority}.`);
      }
  } catch (error) {
      console.error('Error making voice call:', error);
  }
});
  }
};

module.exports = cronJobs;
