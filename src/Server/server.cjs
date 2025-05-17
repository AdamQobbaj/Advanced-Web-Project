const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// MongoDB Models
const Admin = mongoose.model('Admin', new mongoose.Schema({
  name: String,
  password: String
}));

const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  major: String,
  password: String
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

// Connect to MongoDB
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/AdvancedWebProject';
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Apollo Server Schema
const typeDefs = gql`
  type Admin {
    _id: ID!
    name: String!
    password: String!
  }
  type Student {
    _id: ID!
    name: String!
    major: String!
    password: String!
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
  }
  type Mutation {
    addAdmin(name: String!, password: String!): Admin
    addStudent(name: String!, major: String!, password: String!): Student
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

const { Types } = mongoose;
const resolvers = {
  Query: {
    getAdmin: async (_, { id }) => await Admin.findById(id),
    getAllAdmins: async () => await Admin.find(),
    getStudent: async (_, { id }) => await Student.findById(id),
    getAllStudents: async () => await Student.find(),
    getTask: async (_, { id }) => await Task.findById(id),
    getAllTasks: async () => await Task.find(),
    getProject: async (_, { id }) => await Project.findById(id),
    getAllProjects: async () => await Project.find(),
    getMessage: async (_, { id }) => await Message.findById(id),
    getAllMessages: async () => await Message.find(),
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
    addAdmin: async (_, { name, password }) => await new Admin({ name, password }).save(),
    updateAdmin: async (_, { id, name, password }) => {
      return await Admin.findByIdAndUpdate(id, { name, password }, { new: true });
    },
    deleteAdmin: async (_, { id }) => {
      const result = await Admin.findByIdAndDelete(id);
      if (!result) throw new Error('Admin not found');
      return `Admin ${id} deleted`;
    },
    addStudent: async (_, { name, major, password }) => await new Student({ name, major, password }).save(),
    updateStudent: async (_, { id, name, major, password }) => {
      return await Student.findByIdAndUpdate(id, { name, major, password }, { new: true });
    },
    deleteStudent: async (_, { id }) => {
      const result = await Student.findByIdAndDelete(id);
      if (!result) throw new Error('Student not found');
      return `Student ${id} deleted`;
    },
    addTask: async (_, { title, name, description, status, dueDate, studentid, projectid }) => {
        const existingTask = await Task.findOne({ studentid });

        if (existingTask) {
            throw new Error("This student already has a task assigned.");
        }
      return await new Task({
        title,
        name,
        description,
        status,
        dueDate: new Date(dueDate),
        studentid,
        projectid
      }).save();
    },
    updateTask: async (_, { id, ...fields }) => {
      if (fields.dueDate) fields.dueDate = new Date(fields.dueDate);
      return await Task.findByIdAndUpdate(id, fields, { new: true });
    },
    deleteTask: async (_, { id }) => {
      const result = await Task.findByIdAndDelete(id);
      if (!result) throw new Error('Task not found');
      return `Task ${id} deleted`;
    },
    addProject: async (_, { name, description, category, status, startDate, endDate, studentid }) => {
      return await new Project({
        name,
        description,
        category,
        status,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        studentsid: [studentid]
      }).save();
    },
    updateProject: async (_, { id, studentid, ...fields }) => {
      if (fields.startDate) fields.startDate = new Date(fields.startDate);
      if (fields.endDate) fields.endDate = new Date(fields.endDate);
      if (studentid) fields.studentsid = [studentid];
      return await Project.findByIdAndUpdate(id, fields, { new: true });
    },
    deleteProject: async (_, { id }) => {
      const result = await Project.findByIdAndDelete(id);
      if (!result) throw new Error('Project not found');
      return `Project ${id} deleted`;
    },
    addMessage: async (_, { message, time, adminid, studentid }) => {
      return await new Message({ message, time: new Date(time), adminid, studentid }).save();
    },
    updateMessage: async (_, { id, message, time, adminid, studentid }) => {
      return await Message.findByIdAndUpdate(id, { message, time: new Date(time), adminid, studentid }, { new: true });
    },
    deleteMessage: async (_, { id }) => {
      const result = await Message.findByIdAndDelete(id);
      if (!result) throw new Error('Message not found');
      return `Message ${id} deleted`;
    },
  },
};

// Express App Setup
const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
