import { useContext, useState } from "react";
  import { ProjectDataContext } from '../contexts/projectDataContext';
  import { AddProjectContext } from '../contexts/addProjectContext';
  import { ProjectsContext } from '../contexts/projectsContext';
  import ProjectTemp from '../Components/ProjectTemp';
  import AddProgectTemp from '../Components/AddProjectTemp';


 
function AdminProjects() {
  const {projectData, setProjectData } = useContext(ProjectDataContext);
  const [selsctedOption, setSelsctedOption] = useState("All Statuses"); 
  const [searchText, SetsearchText] = useState(""); 

  const {projects, setProjects} = useContext(ProjectsContext); 
  const selectElement = document.getElementById("mySelect");
  const {addedProject, SetaddedProject} = useContext(AddProjectContext);
  const {addProjectFlag, SetaddProjectFlag} = useContext(AddProjectContext);
  const {projectID, SetprojectID} = useContext(AddProjectContext);




  document.addEventListener("click",function(event){
    const selectElement = document.getElementById("mySelect");
    const popup=document.getElementById("popup");
    if (!popup.contains(event.target) && !selectElement.contains(event.target) ) {
        popup.style.visibility="hidden";
      }
      let lest=this.getElementById("lest");
      let childrenArray = Array.from(list.children); // Convert to an array
      let selectedString="font-bold before:content-['✓'] before:text-black h-[15%]";
      let selected=selectedString.split(" ").map(s=>s.trim());


      childrenArray.forEach(child=>{
        if( selected.every(cls => child.classList.contains(cls))){
            selectElement.options[selectElement.selectedIndex].text = child.textContent;
            selectElement.options[selectElement.selectedIndex].value = child.textContent;
            setSelsctedOption(selectElement.options[selectElement.selectedIndex].text.trim());

 
         }
        
        });
        

  })

   const addproject = () => {
    console.log("Add project clicked");
    // your add project logic here
    SetaddProjectFlag(true);
 
    
  };

  const SeletInPro = (event) => {
    
    console.log("Select clicked", event);
    const popup=document.getElementById("popup")
       popup.style.visibility="visible";
 

  
  };




  const selectStopDef = (event) => {
    
    event.preventDefault();
    
  };

  const selectfun = (event) => {
    let li=event.target;
    let ul=li.parentElement;
    let childrenArray = Array.from(ul.children); // Convert to an array
    let selectedString="font-bold before:content-['✓'] before:text-black h-[15%]";
    let selected=selectedString.split(" ").map(s=>s.trim());
    childrenArray.forEach(child=>{
    if( selected.every(cls => child.classList.contains(cls))){
      selected.forEach(cls => {
        child.classList.remove(cls);
      });

    }
    
    });
      selected.forEach(cls => {
        li.classList.add(cls);
      });   
          const popup=document.getElementById("popup")
        popup.style.visibility="hidden";
    
    
  };
  const searchBarHandler= (event)=>{
    SetsearchText(event.target.value);

  }


  const ShowProjectDeta = (event) => {
    
     console.log(event.currentTarget.id);
     event.currentTarget.classList.add("border-orange-500");
    
    setProjectData(event.currentTarget.id.split('-')[1]);
 

  };
  
  const projecsAfterSearch=projects.filter(p=>{
    const query = searchText.toLowerCase();
    if(query.trim()=="")return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

  }).sort((a, b) => {
    const aMatch = a.name.toLowerCase().startsWith(searchText.toLowerCase());
    const bMatch = b.name.toLowerCase().startsWith(searchText.toLowerCase());
    return bMatch - aMatch; // prioritize titles starting with search
  });


  const projectsDivs=projecsAfterSearch.filter(pp=>selsctedOption=="All Statuses" || pp.status==selsctedOption).map(p=>{
     return (<ProjectTemp projectID={p.id} id={"project-"+p.id} onClick={ShowProjectDeta}></ProjectTemp>);
  });
  return (
    <>
    <div className="h-[100%]"> 

    <header className=" items-center h-[15%] mb-5">
        <h2 className="text-2xl font-bold md:text-2xl m-[15px]">Projects Overview</h2>
        <div className="flex justify-between w-[95%] mx-auto h-[45px] max-[800px]:h-[100px]r
        [&_*]:rounded-[7px] [&_*]:h-ful
        ">
           <button className="w-[20%] text-sm	 rounded-[7px] md:h-full bg-[#4285f4] text-white py-2 px-3 md:w-[184px] md:text-lg border-none " onClick={addproject} id="addprojectbtn">
            Add New Project
          </button>
          <input
            type="text"
            className="bg-white placeholder-gray-400 text-black	  w-[50%] md:w-[60%]"
            placeholder="Search projects by title or description..."
            onChange={searchBarHandler}
          />

          <div className="bg-white text-black	  w-[20%] relative md:w-[140px]  ">
            <select
              id="mySelect"
              onClick={SeletInPro}
              onMouseDown={selectStopDef}
              className="w-full h-full"
            >
              <option defaultValue="selected">All Statuses</option>
            </select>

            <div className="  rounded-[7px]   w-full absolute invisible top-[5px] right-[5px] h-[240px] overflow-visible bg-[#B3B4B4] flex" id="popup">
              <ul className="list-none p-0 m-0 w-[95%]
             [&_*]:flex [&_*]:items-center [&_*]:justify-center [&_*]:text-center [&_*]:text-base [&_*]:cursor-pointer [&_*]:text-gray-800 [&_*]:h-[13%] [&_*]:w-[95%] [&_*]:flex-none [&_*]:basis-[calc(100%-10px)] [&_*]:m-[5px] [&_*]:hover:bg-[#404040]

              " id="list">
                <li data-value="all" className=" font-bold before:content-['✓'] before:text-black h-[15%]" onClick={selectfun}>
                  All Statuses
                </li>
                <li   data-value="in-progress" onClick={selectfun}>
                  In Progress
                </li>
                <li  data-value="completed" onClick={selectfun}>
                  Completed
                </li>
                <li  data-value="pending" onClick={selectfun}>
                  Pending
                </li>
                <li   data-value="on-hold" onClick={selectfun}>
                  On Hold
                </li>
                <li   data-value="cancelled" onClick={selectfun}>
                  Cancelled
                </li>
              </ul>
            </div>


          </div>
        </div>
      </header>

      <div className=" flex flex-wrap gap-[30px] justify-center mx-[5%] h-[80%]" id="projects">
        
      {projectsDivs}
      </div>
    </div>
      

     </>
  );
}

export default AdminProjects;
