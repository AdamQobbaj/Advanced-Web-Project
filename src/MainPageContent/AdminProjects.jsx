import { useContext, useState, useEffect } from "react";
import { ProjectDataContext } from "../contexts/projectDataContext";
import { AddProjectContext } from "../contexts/addProjectContext";
import { ProjectsContext } from "../contexts/projectsContext";
import ProjectTemp from "../Components/ProjectTemp";
import { useQuery, gql } from "@apollo/client";

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      _id
      name
      description
      status
      studentsid
      startDate
      endDate
      category
      students {
        name
      }
    }
  }
`;

function AdminProjects() {
  const { projectData, setProjectData } = useContext(ProjectDataContext);
  const { projects, setProjects } = useContext(ProjectsContext);
  const {
    addedProject,
    SetaddedProject,
    addProjectFlag,
    SetaddProjectFlag,
    projectID,
    SetprojectID, 
   

  } = useContext(AddProjectContext);

  const [selectedOption, setSelectedOption] = useState("All Statuses");
  const [searchText, setSearchText] = useState("");

  const { loading, data, error, refetch } = useQuery(GET_ALL_PROJECTS);
   useEffect(() => {
    if (data && data.getAllProjects) {
      const projectsTemp = data.getAllProjects.map((pro) => {
        const StartDate = new Date(Number(pro.startDate));
        const EndDate = new Date(Number(pro.endDate));

        return {
          id: pro._id,
          name: pro.name,
          description: pro.description,
          status: pro.status,
          students: pro.students.map((s) => s.name),
          category: pro.category,
          startDate: StartDate.toLocaleDateString(),
          endDate: EndDate.toLocaleDateString(),
        };
      });
      setProjects(projectsTemp);
    }
  }, [data]);

  useEffect(() => {
    const handleClick = (event) => {
      const selectElement = document.getElementById("mySelect");
      const popup = document.getElementById("popup");
      const list = document.getElementById("list");
      if (!selectElement || !popup || !list) return;

      if (
        !popup.contains(event.target) &&
        !selectElement.contains(event.target)
      ) {
        popup.style.visibility = "hidden";
      }

      const childrenArray = Array.from(list.children);
      const selectedString =
        "font-bold before:content-['✓'] before:text-black h-[15%]";
      const selected = selectedString.split(" ").map((s) => s.trim());

      childrenArray.forEach((child) => {
        if (selected.every((cls) => child.classList.contains(cls))) {
          const text = child.textContent;
          selectElement.options[selectElement.selectedIndex].text = text;
          selectElement.options[selectElement.selectedIndex].value = text;
          setSelectedOption(text.trim());
        }
      });
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const addProject = () => {
    SetaddProjectFlag(true);
  };

  const selectInPro = (event) => {
    const popup = document.getElementById("popup");
    if (popup) popup.style.visibility = "visible";
  };

  const selectStopDef = (event) => {
    event.preventDefault();
  };

  const selectFun = (event) => {
    const li = event.target;
    const ul = li.parentElement;
    const childrenArray = Array.from(ul.children);
    const selectedString =
      "font-bold before:content-['✓'] before:text-black h-[15%]";
    const selected = selectedString.split(" ").map((s) => s.trim());

    childrenArray.forEach((child) => {
      if (selected.every((cls) => child.classList.contains(cls))) {
        selected.forEach((cls) => child.classList.remove(cls));
      }
    });

    selected.forEach((cls) => li.classList.add(cls));
    const popup = document.getElementById("popup");
    if (popup) popup.style.visibility = "hidden";
  };

  const searchBarHandler = (event) => {
    setSearchText(event.target.value);
  };

  const showProjectDetails = (event) => {
    
    event.currentTarget.classList.remove("border-transparent");
    event.currentTarget.classList.add("border-orange-500");
    setProjectData(event.currentTarget.id.split("-")[1]);
   };

  const projecsAfterSearch = (projects || [])
    .filter((p) => {
      const query = searchText.toLowerCase();
      if (query.trim() === "") return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aMatch = a.name.toLowerCase().startsWith(searchText.toLowerCase());
      const bMatch = b.name.toLowerCase().startsWith(searchText.toLowerCase());
      return bMatch - aMatch;
    });

  const projectsDivs = projecsAfterSearch
    .filter(
      (p) => selectedOption === "All Statuses" || p.status === selectedOption
    )
    .map((p) => (
      <ProjectTemp
        key={p.id}
        projectID={p.id}
        id={`project-${p.id}`}
        onClick={showProjectDetails}
      />
    ));

  return (
    <div className="h-[100%]">
      <header className="items-center     mb-[50px]">
        <h2 className="text-2xl font-bold md:text-2xl m-[15px]">
          Projects Overview
        </h2>
        <div className="flex justify-between   max-[1300px]:items-center   w-[95%] mx-auto   [&_*]:rounded-[7px] max-[1300px]:flex-col ">
          <button
            className="w-[20%] text-sm rounded-[7px] md:h-[45px] h-[60px] bg-[#4285f4] text-white py-2 px-3 md:w-[184px] md:text-lg border-none max-[1300px]:order-2 "
            onClick={addProject}
            id="addprojectbtn"
          >
            Add New Project
          </button>
          <div className="flex justify-between w-[80%] max-[1300px]:w-[100%] max-[1300px]:mb-[20px] " >
          <input
            type="text"
            className="bg-white placeholder-gray-400 text-black h-[45px] w-[50%] md:w-[80%] mx-[20px]"
            placeholder="Search projects by title or description..."
            onChange={searchBarHandler}
          />
          <div className="bg-white text-black w-[20%] h-[45px] relative md:w-[140px]">
            <select
              id="mySelect"
              onClick={selectInPro}
              onMouseDown={selectStopDef}
              className="w-full h-full"
            >
              <option defaultValue="selected">All Statuses</option>
            </select>

            <div
              className="rounded-[7px] w-full absolute invisible top-[5px] right-[5px] h-[240px] bg-[#B3B4B4] flex"
              id="popup"
            >
              <ul
                className="list-none p-0 m-0 w-[95%]
                [&_*]:flex [&_*]:items-center [&_*]:justify-center [&_*]:text-center [&_*]:text-base [&_*]:cursor-pointer [&_*]:text-gray-800 [&_*]:h-[13%] [&_*]:w-[95%] [&_*]:flex-none [&_*]:basis-[calc(100%-10px)] [&_*]:m-[5px] [&_*]:hover:bg-[#404040]"
                id="list"
              >
                <li
                  data-value="all"
                  className="font-bold before:content-['✓'] before:text-black h-[15%]"
                  onClick={selectFun}
                >
                  All Statuses
                </li>
                <li data-value="in-progress" onClick={selectFun}>
                  In Progress
                </li>
                <li data-value="completed" onClick={selectFun}>
                  Completed
                </li>
                <li data-value="pending" onClick={selectFun}>
                  Pending
                </li>
                <li data-value="on-hold" onClick={selectFun}>
                  On Hold
                </li>
                <li data-value="cancelled" onClick={selectFun}>
                  Cancelled
                </li>
              </ul>
            </div>
          </div>
            </div>
        </div>
      </header>

      <div
        className="flex flex-wrap gap-[30px] justify-center mx-[5%] h-[80%]"
        id="projects"
      >
        {projectsDivs}
      </div>
    </div>
  );
}

export default AdminProjects;
