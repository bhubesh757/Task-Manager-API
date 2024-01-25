const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     completed: { type: Boolean, default: false },
//     owner:{
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// },{
//     timestamps: true
// });







const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    due_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'DONE'],
      default: 'TODO',
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subtasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subtask',
        },
      ],
    deletedAt: {
      type: Date,
      default: null,
    },
  }, { timestamps: true });





const Task = mongoose.model('Task', taskSchema);
module.exports = Task;