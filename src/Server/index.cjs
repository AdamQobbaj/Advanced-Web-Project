const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');
const { get } = require('http');


require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;



mongoose.connect('mongodb://localhost:27017/AdvancedWebProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));


const adminSchema = new mongoose.Schema({
  id: Number,
  name: String,
  password: String
});
const studentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  major: String,
  password: String
});
const taskSchema = new mongoose.Schema({
  id: Number,
  title: String,
  name: String,
  description: String,
  status: String,
  dueDate: Date,
  projectid: String
});

const projectSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  category: String,
  status: String,
  startDate: Date,
  endDate: Date
});
const messageSchema = new mongoose.Schema({
  id: Number,
  admin: String,
  student: String,
  message: String,
  time: Date
});

const Admin = mongoose.model('Admin', adminSchema);
const Student = mongoose.model('Student', studentSchema);
const Task = mongoose.model('Task', taskSchema);
const Project = mongoose.model('Project', projectSchema);
const Message = mongoose.model('Message', messageSchema);





app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use(cors({
  origin: 'http://localhost:5173', // your Vite dev server
}));







const schema = buildSchema(`
  type Admin {
    id: ID!
    name: String!
    password: String!
  }
  type Student {
    id: ID!
    name: String!
    major: String!
    password: String!
  }
  type Project {
    id: ID!
    name: String!
    description: String!
    category: String!
    status: String!
    startDate: String!
    endDate: String!
    studentsid: [String]
    students: [Student]
  }
  type Task {
    id: ID!
    title: String!
    name: String!
    description: String!
    status: String!
    dueDate: String!
    studentid: String!
    student: Student
  }
  type Message {
    id: ID!
    message: String!
    time: String!
    adminid: String!
    studentid: String!
    admin: Admin
    student: Student
  }
  type Query {
    getAdmin(id: ID!): Admin
    getAllAdmins: [Admin]
    getStudent(id: ID!): Student
    getAllStudents: [Student]
    getTask(id: ID!): Task
    getAllTasks: [Task]
    getProject(id: ID!): Project
    getAllProjects: [Project]
    getMessage(id: ID!): Message
    getAllMessages: [Message]
  }
  type Mutation {
    addAdmin(name: String!, password: String!): Admin
    addStudent(name: String!, major: String!, password: String!): Student
    addTask(title: String!, name: String!, description: String!, status: String!, dueDate: String!, projectid: String!): Task
    addProject(name: String!, description: String!, category: String!, status: String!, startDate: String!, endDate: String!): Project
    addMessage(admin: String!, student: String!, message: String!, time: String!): Message

    updateAdmin(id: ID!, name: String, password: String): Admin
    updateStudent(id: ID!, name: String, major: String, password: String): Student
    updateTask(id: ID!, title: String, name: String, description: String, status: String, dueDate: String, projectid: String): Task
    updateProject(id: ID!, name: String, description: String, category: String, status: String, startDate: String, endDate: String): Project
    updateMessage(id: ID!, admin: String, student: String, message: String, time: String): Message

    deleteAdmin(id: ID!): String
    deleteStudent(id: ID!): String
    deleteTask(id: ID!): String
    deleteProject(id: ID!): String
    deleteMessage(id: ID!): String
  }
`);


const root = {
  
    getAdmin: async ({ id }) => {
      const admin = await Admin.findOne({ id });
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    }
  ,
    getAllAdmins: async () => {
      const admins = await Admin.find();
      if (!admins) {
        throw new Error('No admins found');
      }
      return admins;
    },
    getStudent: async ({ id }) => {
      const student = await
      Student.findOne({ id });
      if (!student) {
        throw new Error('Student not found');
      }
      return student;
    }
  ,
    getAllStudents: async () => {
      const students = await Student.find();
      if (!students) {
        throw new Error('No students found');
      }
      return students;
    }
  ,
    getTask: async ({ id }) => {
      const task = await Task.findOne({ id });
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    }
  ,
    getAllTasks: async () => {
      const tasks = await Task.find();
      if (!tasks) {
        throw new Error('No tasks found');
      }
      return tasks;
    }
  ,
    Task: {
      student: async (task) => {
        const student = await Student.findOne({ id: task.studentid });
        if (!student) {
          throw new Error('Student not found');
        }
        return student;
    }
  }
  ,
    getProject: async ({ id }) => {
      const project = await Project.find({ id });
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    }
  , 
    getAllProjects: async () => {
      const projects = await Project.find();
      if (!projects) {
        throw new Error('No projects found');
      }
      return projects;
    }
  ,
    Project: {
      students: async (project) => {
        const students = await Student.find({ id: { $in: project.studentsid } });
        if (!students) {
          throw new Error('Students not found');
        }
        return students;
      }
    }
  ,
    getMessage: async ({ id }) => {
      const message = await Message.find({ id });
      if (!message) {
        throw new Error('Message not found');
      }
      return message;
    }
  ,
    getAllMessages: async () => {
      const messages = await Message.find();
      if (!messages) {
        throw new Error('No messages found');
      }
      return messages;
    }
  ,
    addAdmin: async ({ name, password }) => {
      if (!name || !password) {
        throw new Error('Name and password are required');
      }
      const existingAdmin = await Admin.find({ name });
      if (existingAdmin && existingAdmin.length > 0) {
        throw new Error('Admin already exists');
      }
      id = await Admin.countDocuments() + 1;
      const admin = new Admin({ id, name, password});
      await admin.save();
      return admin;
    }
  ,
    addStudent: async ({ name, major, password }) => {
      if (!name || !major || !password) {
        throw new Error('Name, major and password are required');
      }
      const existingStudent = await Student.find({ name });
      if (existingStudent && existingStudent.length > 0) {
        throw new Error('Student already exists');
      }
      id = await Student.countDocuments() + 1;
      const student = new Student({ id, name, major, password });
      await student.save();
      return student;
    }
  ,
    addTask: async ({ title, name, description, status, dueDate, projectid }) => {
      if (!title || !name || !description || !status || !dueDate || !projectid) {
        throw new Error('All fields are required');
      }
      projectid = await Project.find({ id: projectid });
      if (!projectid || projectid.length === 0) {
        throw new Error('Project not found');
      }
      const existingTask = await Task.find({ title });
      if (existingTask && existingTask.length > 0) {
        throw new Error('Task already exists');
      }
      id = await task.f
      const task = new Task({ id, title, name, description, status, dueDate, projectid });
      await task.save();
      return task;
    }
  ,
    addProject: async ({ name, description, category, status, startDate, endDate }) => {
      if (!name || !description || !category || !status || !startDate || !endDate) {
        throw new Error('All fields are required');
      }
      const existingProject = await Project.find({ name });
      if (existingProject && existingProject.length > 0) {
        throw new Error('Project already exists');
      }
      id = await Project.countDocuments() + 1;
      const project = new Project({ id, name, description, category, status, startDate, endDate });
      await project.save();
      return project;
    }
  ,
    addMessage: async ({ admin, student, message, time }) => {
      if (!admin || !student || !message || !time) {
        throw new Error('All fields are required');
      }
      const existingAdmin = await Admin.find({ name: admin });
      if (!existingAdmin || existingAdmin.length === 0) {
        throw new Error('Admin not found');
      }
      const existingStudent = await Student.find({ name: student });
      if (!existingStudent || existingStudent.length === 0) {
        throw new Error('Student not found');
      }
      id = await Message.countDocuments() + 1;
      const msg = new Message({ id, admin, student, message, time });
      await msg.save();
      return msg;
    }
  ,
    updateAdmin: async ({ id, name, password }) => {
      const admin = await Admin.findOne({ id });
      if (!admin) {
        throw new Error('Admin not found');
      }
      if (name) admin.name = name;
      if (password) admin.password = password;
      await admin.save();
      return admin;
    }
  ,
    updateStudent: async ({ id, name, major, password }) => {
      const student = await Student.findOne({ id });
      if (!student) {
        throw new Error('Student not found');
      }
      if (name) student.name = name;
      if (major) student.major = major;
      if (password) student.password = password;
      await student.save();
      return student;
    }
  , 
    updateTask: async ({ id, title, name, description, status, dueDate, projectid }) => {
      const task = await Task.findOne({ id });
      if (!task) {
        throw new Error('Task not found');
      }
      if (title) task.title = title;
      if (name) task.name = name;
      if (description) task.description = description;
      if (status) task.status = status;
      if (dueDate) task.dueDate = dueDate;
      if (projectid) task.projectid = projectid;
      await task.save();
      return task;
    }
  ,
    updateProject: async ({ id, name, description, category, status, startDate, endDate }) => {
      const project = await Project.findOne({ id });
      if (!project) {
        throw new Error('Project not found');
      }
      if (name) project.name = name;
      if (description) project.description = description;
      if (category) project.category = category;
      if (status) project.status = status;
      if (startDate) project.startDate = startDate;
      if (endDate) project.endDate = endDate;
      await project.save();
      return project;
    }
  ,
    updateMessage: async ({ id, admin, student, message, time }) => {
      const msg = await Message.findOne({ id });
      if (!msg) {
        throw new Error('Message not found');
      }
      if (admin) msg.admin = admin;
      if (student) msg.student = student;
      if (message) msg.message = message;
      if (time) msg.time = time;
      await msg.save();
      return msg;
    }
  ,
    deleteAdmin: async ({ id }) => {
      const admin = await Admin.findOne({ id });
      if (!admin) {
        throw new Error('Admin not found');
      }
      await Admin.deleteOne({ id });
      return `Admin with id ${id} deleted`;
    }
  ,
    deleteStudent: async ({ id }) => {
      const student = await Student.findOne({ id });
      if (!student) {
        throw new Error('Student not found');
      }
      await Student.deleteOne({ id });
    }
  ,
    deleteTask: async ({ id }) => {
      const task = await Task.findOne({ id });
      if (!task) {
        throw new Error('Task not found');
      }
      await Task.deleteOne({ id });
      return `Task with id ${id} deleted`;
    }
  ,
    deleteProject: async ({ id }) => {
      const project = await Project.findOne({ id });
      if (!project) {
        throw new Error('Project not found');
      }
      await Project.deleteOne({ id });
      return `Project with id ${id} deleted`;
    }
  ,
    deleteMessage: async ({ id }) => {
      const msg = await Message.findOne({ id });
      if (!msg) {
        throw new Error('Message not found');
      }
      await Message.deleteOne({ id });
      return `Message with id ${id} deleted`;
    }
}



app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));  




/*
app.get('/get-admin', async (req, res) => {
  try {
    const adminId = req.query.id;
    console.log(adminId);
    const admin = await Admin.find({id: adminId});
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get-all-admins', async (req, res) => {
  try {
    const admin = await Admin.find();
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get-student', async (req, res) => {
  try {
    const studentId = req.query.id;
    console.log(studentId);
    const student = await Student.find({id: studentId});
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
);

app.get('/get-all-students', async (req, res) => {
  try {
    const student = await Student.find();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get-task', async (req, res) => {
  try {
    const taskId = req.query.id;
    console.log(taskId);
    const task = await Task.find({id: taskId});
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
);
app.get('/get-all-tasks', async (req, res) => {
  try {
    const task = await Task.find();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get-project', async (req, res) => {
  try {
    const projectId = req.query.id;
    console.log(projectId);
    const project = await Project.find({id: projectId});
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
);

app.get('/get-all-projects', async (req, res) => {
  try {
    const project = await Project.find();
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 
);

app.get('/get-message', async (req, res) => {
  try {
    const messageId = req.query.id;
    console.log(messageId);
    const message = await Message.find({id: messageId});
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/get-all-messages', async (req, res) => {
  try {
    const message = await Message.find();
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
);
*/








//in react
/*

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `
                query {
                  getAdmin(id: "1") {
                    name
                  }
                }
              `
            })
          });

          const data = await res.json();
          alert(data.data.getAdmin.name);
        } catch (err) {
          console.error('Fetch error:', err);
          alert('Error fetching data. See console.');
        }
      };

      fetchData();
    }, []);

*/