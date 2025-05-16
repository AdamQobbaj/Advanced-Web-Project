import { StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; 
import { CurrentPageProvider } from './contexts/currentPage';
import { CurrentMainContentProvider } from './contexts/currentMainContent';
import { ProjectDataProvider } from './contexts/projectDataContext';
import { AddProjectProvider } from './contexts/addProjectContext';
import { ProjectsProvider } from './contexts/projectsContext';





let admins = [
  { id: 1, name: "Ali", password: "0000" },
  { id: 2, name: "Adam", password: "0000" },
  { id: 3, name: "Ahmad", password: "0000" },
  { id: 4, name: "Eyas", password: "0000" },
  { id: 5, name: "Maher", password: "0000" },
  
];


localStorage.setItem("admins", JSON.stringify(admins));

let students = [
  { id: 1, name: "adam", major: "Computer Science", password: "0000" },
  { id: 2, name: "Student 2", major: "Data Science", password: "0000"  },
  { id: 3, name: "Student 3", major: "Data Science", password: "0000"  },
  { id: 4, name: "Student 4", major: "Data Science", password: "0000"  },
  { id: 5, name: "Student 5", major: "Data Science", password: "0000"  },
  { id: 6, name: "Student 6", major: "Data Science", password: "0000"  },
  { id: 7, name: "Student 7", major: "Data Science", password: "0000"  }

];

// Save students to local storage
localStorage.setItem("students", JSON.stringify(students));

let tasks = [
  { id: 101, title: "Design Homepage",name:"efwc",description:"dcdcsdc",students:[1], status: "Completed",projectid:"1" , dueDate:"2024-07-15"},
  { id: 102, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"2", dueDate:"2024-07-15"},
  { id: 103, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"2", dueDate:"2024-07-15"},
  { id: 104, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"3", dueDate:"2024-07-15"},
  { id: 105, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
  { id: 106, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
    { id: 107, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
  { id: 108, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
  { id: 109, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
  { id: 110, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},
  { id: 111, title: "Develop AI",name:"efkkkwc",description:"dcdcsdjjjc",students:[2], status: "In Progress",projectid:"4", dueDate:"2024-07-15"},

];

// Save tasks to local storage
localStorage.setItem("tasks", JSON.stringify(tasks));




let projects = [
  {
      id: 1,
      name: "AI Research",
      description: "A project on artificial intelligence applications",
      category:"Web Development",
      status:"In Progress",
      percentage:50,
      startDate:"2024-03-15",
      endDate:"2024-07-15",
      students: [1, 2],  
      tasks: [101]  
  },

  {
      id: 2,
      name: "AI Reseadvslrch",
      description: "A project on artificial intelligence applications",
      category:"Web Development",
      status:"In Progress",
      percentage:40,
      startDate:"2024-03-10",
      endDate:"2024-07-10",
      students: [1, 2],  
      tasks: [102, 103]  
  },
  {
      id: 3,
      name: "evvfe rer",
      description: "A project jlnlejtl  on artificial intelligence applications",
      category:"Web Development",
      status:"In Progress",
      percentage:70,
      startDate:"2020-03-15",
      endDate:"2024-07-15",
      students: [1, 2],  
      tasks: [104]  
  },
  {
      id: 4,
      name: "ege rg ",
      description: "A proje intelligence applications",
      category:"Web Development",
      status:"Completed",
      percentage:100,

      startDate:"2024-03-15",
      endDate:"2025-07-15",
      students: [3, 2],  
      tasks: [105, 106,107,108,109,110,111]   
  },
  {
      id: 5,
      name: "gggerf ",
      description: "A projec gence applications",
      category:"Web Development",
      status:"In Progress",
      percentage:30,
      startDate:"2024-03-15",
      endDate:"2024-07-15",
      students: [1, 3],  
      tasks: []  
  }
 



];
localStorage.setItem("projects", JSON.stringify(projects));

let messages = [
  { id: 1, admin: "Adam", student: "adam", message: "Hello 1, how are you?", time: "Monday, March 17, 2025 at 1:02:54 PM" },
  { id: 2, admin: "Adam", student: "adam", message: "Hello Adam, how are you?", time: "Monday, March 17, 2025 at 1:02:54 PM" },
  { id: 3, admin: "Ali", student: "Student 4", message: "Hello 4, how are you?", time: "Monday, March 17, 2025 at 1:02:54 PM" },
  { id: 4, admin: "Ahmad", student: "Student 3", message: "Hello 3, how are you?", time: "Monday, March 17, 2025 at 1:02:54 PM" },
  { id: 5, admin: "Eyas", student: "Student 4", message: "Hello 5, how are you?", time: "Monday, March 17, 2025 at 1:02:54 PM" },
];
localStorage.setItem("messages", JSON.stringify(messages));









createRoot(document.getElementById('root')).render(
  
  <StrictMode>
      <CurrentPageProvider>
          <CurrentMainContentProvider>
            <ProjectsProvider>
              <ProjectDataProvider>
                <AddProjectProvider>
                  <App />
                </AddProjectProvider>
               </ProjectDataProvider>
            </ProjectsProvider>
 
          </CurrentMainContentProvider>
      </CurrentPageProvider>
  </StrictMode>
);



