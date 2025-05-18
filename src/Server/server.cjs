const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { compact } = require('@apollo/client/utilities');
const { uid } = require('chart.js/helpers');
require('dotenv').config();

// MongoDB Models
const Admin = mongoose.model('Admin', new mongoose.Schema({
  name: String,
  password: String
}));

const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  major: String,
  password: String,
  uid: String
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  title: String,
  name: String,
  description: String,
  status: String,
  dueDate: Date,
  projectid: mongoose.Schema.Types.ObjectId,
  studentid: mongoose.Schema.Types.ObjectId
}));

const Project = mongoose.model('Project', new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  status: String,
  startDate: Date,
  endDate: Date,
  studentsid: [mongoose.Schema.Types.ObjectId]
}));

const Message = mongoose.model('Message', new mongoose.Schema({
  message: String,
  time: Date,
  adminid: mongoose.Schema.Types.ObjectId,
  studentid: mongoose.Schema.Types.ObjectId
}));

// MongoDB Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/AdvancedWebProject';
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// GraphQL Schema
const typeDefs = gql`
  type Admin {
    _id: ID!
    name: String!
    password: String!
  }
  type Student {
    _id: ID!
    name: String!
    password: String!
    uid: String!
  }
  type Project {
    _id: ID!
    name: String!
    description: String!
    category: String!
    status: String!
    startDate: String!
    endDate: String!
    studentsid: [ID!]
    students: [Student]
  }
  type Task {
    _id: ID!
    title: String!
    name: String!
    description: String!
    status: String!
    dueDate: String!
    studentid: ID!
    student: Student
    projectid: ID!
    project: Project
  }
  type Message {
    _id: ID!
    message: String!
    time: String!
    adminid: ID!
    studentid: ID!
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
    getAllTasksByStudent(studentid: ID!): [Task]
    getAllProjectsByStudent(studentid: ID!): [Project]
    getAllMessagesByStudent(studentid: ID!): [Message]
    getAllMessagesByAdmin(adminid: ID!): [Message]
    getTaskByProjectAndStudent(projectid: ID!, studentid: ID!): Task
    getStudentByName(name: String!): Student
    getAdminByName(name: String!): Admin
    getProjectByName(name: String!): Project
    getTaskByName(name: String!): Task
  }
  type AuthPayload {
    token: String!
    id: ID!
  }
  type Mutation {
    loginAdmin(name: String!, password: String!): AuthPayload
    loginStudent(name: String!, password: String!): AuthPayload
    addAdmin(name: String!, password: String!): Admin
    addStudent(name: String!, password: String!, uid: String!): Student
    addTask(title: String!, name: String!, description: String!, status: String!, dueDate: String!, studentid: ID!, projectid: ID!): Task
    addProject(name: String!, description: String!, category: String!, status: String!, startDate: String!, endDate: String!, studentid: ID!): Project
    addMessage(message: String!, time: String!, adminid: ID!, studentid: ID!): Message
    updateAdmin(id: ID!, name: String, password: String): Admin
    updateStudent(id: ID!, name: String, major: String, password: String): Student
    updateTask(id: ID!, title: String, name: String, description: String, status: String, dueDate: String, studentid: ID, projectid: ID): Task
    updateProject(id: ID!, name: String, description: String, category: String, status: String, startDate: String, endDate: String, studentid: ID): Project
    updateMessage(id: ID!, message: String!, time: String!, adminid: ID!, studentid: ID!): Message
    deleteAdmin(id: ID!): String
    deleteStudent(id: ID!): String
    deleteTask(id: ID!): String
    deleteProject(id: ID!): String
    deleteMessage(id: ID!): String
  }
`;

const resolvers = {
  Query: {

    // Admin & Student Queries
    getAdmin: async (_, { id }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Admin.findById(id).select('-password');
    },
    getAllAdmins: async (_,a,context) =>{//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Admin.find().select('-password');
    },
    getStudent: async (_, { id }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Student.findById(id).select('-password');
    },
    getStudentByName: async (_, { name }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Student.findOne({ name }).select('-password');
    },
    getAdminByName: async (_, { name }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Admin.findOne({ name }).select('-password');
    },
    getProject: async (_, { id }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Project.findById(id);
    },
    getProjectByName: async (_, { name }, context) => {//
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'student')) throw new Error("Unauthorized");
      return await Project.findOne({ name });
    },


    // Admin Queries
    getAllStudents: async (_,a,context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      return await Student.find().select('-password');
    },
    getTask: async (_, { id }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized"); 
      return await Task.findById(id);
    },
    getAllTasks: async (_, a, context) => {
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      return await Task.find();
    },
    getAllProjects: async (_, a, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      return await Project.find();
    },
    getMessage: async (_, { id }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      return await Message.findById(id);
    },/*
    getAllMessages: async (_, a, context) => {
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      return await Message.find();
    },*/
    
    getAllMessagesByAdmin: async (_, { adminid }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      const admin = await Admin.findById(adminid);
      if (!admin) throw new Error("Admin not found");
      const messages = await Message
        .find({ adminid })
        .populate('adminid', 'name')
        .populate('studentid', 'name');
      return messages;
    },

    // Student Queries
    getTaskByName: async (_, { name }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      return await Task.find ({ name });
    },

    getAllTasksByStudent: async (_, { studentid }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const student = await Student.findById(studentid);
      console.log(student)
      if (!student) throw new Error("Student not found");
      const tasks = await Task.find({ studentid });
      console.log(tasks)
      return tasks;
    },
    getAllProjectsByStudent: async (_, { studentid }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const projects = await Project.find({ studentsid: studentid });
      return projects;
    },
    getAllMessagesByStudent: async (_, { studentid }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const messages = await Message
        .find({ studentid })
        .populate('adminid', 'name')
        .populate('studentid', 'name');
      return messages;
    },

    getTaskByProjectAndStudent: async (_, { projectid, studentid }) => {//
      const project = await Project.findById(projectid);
      if (!project) throw new Error("Project not found");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const tasks = await Task.findOne({ projectid, studentid });
      return tasks;
    },
  },
  Task: {
    student: async (task) => task.studentid ? await Student.findById(task.studentid) : null,
    project: async (task) => task.projectid ? await Project.findById(task.projectid) : null,
  },
  Project: {
    students: async (project) => project.studentsid.length ? await Student.find({ _id: { $in: project.studentsid } }) : [],
  },
  Message: {
    admin: async (message) => message.adminid ? await Admin.findById(message.adminid) : null,
    student: async (message) => message.studentid ? await Student.findById(message.studentid) : null,
  },
  Mutation: {
    loginAdmin: async (_, { name, password }) => {//
      const admin = await Admin.findOne({ name });
      if (!admin) throw new Error("Admin not found");
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new Error("Invalid password");
      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const id = admin._id;
      return { token, id };
    },
    loginStudent: async (_, { name, password }) => {//
      const student = await Student.findOne({ name });
      if (!student) throw new Error("Student not found");
      const valid = await bcrypt.compare(password, student.password);
      if (!valid) throw new Error("Invalid password");
      const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const id = student._id;
      return { token, id };
    },

    addAdmin: async (_, { name, password }) => {
      if (!name || !password) throw new Error("Name and password are required");
      const existingAdmin = await Admin.findOne({ name });
      if (existingAdmin) throw new Error("Admin already exists");
      const hashedPassword = await bcrypt.hash(password, 10);
      return await new Admin({ name, password: hashedPassword }).save();
    },/*
    updateAdmin: async (_, { id, name, password }) => {
      const update = {};
      if (name) update.name = name;
      if (password) update.password = await bcrypt.hash(password, 10);
      return await Admin.findByIdAndUpdate(id, update, { new: true });
    },
    deleteAdmin: async (_, { id }) => {
      const result = await Admin.findByIdAndDelete(id);
      if (!result) throw new Error('Admin not found');
      return `Admin ${id} deleted`;
    },*/

    addStudent: async (_, {name, password, uid }) => {//
      if (!name || !password || !uid) throw new Error("Name, password and UID are required");
      const existingStudent = await Student.findOne({ name });
      if (existingStudent) throw new Error("Student already exists")
      const existingUid = await Student.findOne({ uid });
      if (existingUid) throw new Error("UID already exists");
      const hashedPassword = await bcrypt.hash(password, 10);
      return await new Student({ name, password: hashedPassword, uid }).save();
    },
    updateStudent: async (_, { id, name, password, uid }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const update = {};
      if (name) update.name = name;
      if (password) update.password = await bcrypt.hash(password, 10);
      if (uid) update.uid = uid;
      const student = await Student.findById(id);
      if (!student) throw new Error("Student not found");
      if (student.password !== password) {
        const hashedPassword = await bcrypt.hash(password, 10); 
        update.password = hashedPassword;
      }
      return await Student.findByIdAndUpdate(id, update, { new: true });
    },
    deleteStudent: async (_, { id }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const result = await Student.findByIdAndDelete(id);
      if (!result) throw new Error('Student not found');
      return `Student ${id} deleted`;
    },

    addTask: async (_, { title, name, description, status, dueDate, studentid, projectid }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      if (!title || !name || !description || !status || !dueDate || !studentid || !projectid) throw new Error("All fields are required");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const project = await Project.findById(projectid);
      if (!project) throw new Error("Project not found");
      const task = new Task({ title, name, description, status, dueDate: new Date(dueDate), studentid, projectid });
      await task.save();
      return task;
    },
    updateTask: async (_, { id, ...fields }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      if (fields.dueDate) fields.dueDate = new Date(fields.dueDate);
      if (fields.studentid) {
        const student = await Student.findById(fields.studentid);
        if (!student) throw new Error("Student not found");
      }
      if (fields.projectid) {
        const project = await Project.findById(fields.projectid);
        if (!project) throw new Error("Project not found");
      }
      return await Task.findByIdAndUpdate(id, fields, { new: true });
    },
    deleteTask: async (_, { id }, context) => {//
      if (!context.user || context.user.role !== 'student') throw new Error("Unauthorized");
      const result = await Task.findByIdAndDelete(id);
      if (!result) throw new Error('Task not found');
      return `Task ${id} deleted`;
    },

    addProject: async (_, { name, description, category, status, startDate, endDate, studentid }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      if (!name || !description || !category || !status || !startDate || !endDate || !studentid) throw new Error("All fields are required");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const project = new Project({ name, description, category, status, startDate: new Date(startDate), endDate: new Date(endDate), studentsid: [studentid] });
      await project.save(); 
      return project;
    }, 
    updateProject: async (_, { id, studentid, ...fields }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      if (fields.startDate) fields.startDate = new Date(fields.startDate);
      if (fields.endDate) fields.endDate = new Date(fields.endDate);
      if (studentid) {
        const student = await Student.findById(studentid);
        if (!student) throw new Error("Student not found");
        fields.studentsid = compact([...(fields.studentsid || []), studentid]);
      }
      return await Project.findByIdAndUpdate(id, fields, { new: true });
    },
    deleteProject: async (_, { id }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      const result = await Project.findByIdAndDelete(id);
      if (!result) throw new Error('Project not found');
      return `Project ${id} deleted`;
    },

    addMessage: async (_, { message, time, adminid, studentid }, context) => {//
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      if (!message || !time || !adminid || !studentid) throw new Error("All fields are required");
      const admin = await Admin.findById(adminid);
      if (!admin) throw new Error("Admin not found");
      const student = await Student.findById(studentid);
      if (!student) throw new Error("Student not found");
      const msg = new Message({ message, time: new Date(time), adminid, studentid });
      await msg.save();
      return msg;
    },
    /*updateMessage: async (_, { id, ...fields }, context) => {
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      if (fields.time) fields.time = new Date(fields.time);
      if (fields.adminid) {
        const admin = await Admin.findById(fields.adminid);
        if (!admin) throw new Error("Admin not found");
      }
      if (fields.studentid) {
        const student = await Student.findById(fields.studentid);
        if (!student) throw new Error("Student not found");
      }
      return await Message.findByIdAndUpdate(id, fields, { new: true });
    },
    deleteMessage: async (_, { id }, context) => {
      if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized");
      const result = await Message.findByIdAndDelete(id);
      if (!result) throw new Error('Message not found');
      return `Message ${id} deleted`;
    }*/
  },
}

// Middleware and Server
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  //origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

const getUserFromToken = (token) => {
  try {
    if (token) return jwt.verify(token, process.env.JWT_SECRET);
    return null;
  } catch {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = getUserFromToken(token);
    return { user };
  }
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({
      app,
      cors: corsOptions
    });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
