import { useEffect, useState } from "react";

function ControlledInputs(){
  let [name,setName] = useState('');
  let [sites,setSites] = useState([]);
  let [currPage,setCurrPage] = useState([]);
  let [currCount,setCurrCount] = useState(1); //page
  let [mode,setMode] = useState(1); //search or select
  let [selected,setSelected] = useState([]); //selected sites
  let [clone,setClone] = useState([]);
  let [sumText,setSum] = useState([]);
  let [isUpdate,changeUpdateStatus] = useState(1);
  let pageLimit = 9;
  
  function handleSubmit(e){
    e.preventDefault(); //required
  }

  function SiteItem({name,site}){

  return (
    <>

    <div className="siteItem">
        <h1>
            {name}
        </h1>
        <br></br>
        <div id="buttonChoices">
          <button onClick={()=>{addSite(name,site)}}>+</button>
          <a href={site} target="_blank" rel="noopener noreferrer">
          <button onClick={()=>{}}>⎘</button>
          </a>
        </div>
    </div>

    </>
  )
}

  useEffect(()=>{
    fetch("http://localhost:2000/api/search", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({value: name})
    })
    .then(response => response.json())
    .then(data => {
      if(data.data.length != 0){
        setSites(data.data);
        setCurrCount(1);
        document.getElementById("PageControl").style.visibility = "visible";
      }
      console.log(data)
    })
    .catch(err=>console.log(err))
  },[name]) // the entire database
  
  useEffect(() => {
  // Ensure count is in valid range
  if (currCount <= 0) {
    setCurrCount(1);
    return;
  }

  if (sites.length === 0) {
    setCurrPage([]);
    return;
  }

  const totalPages = Math.ceil(sites.length / pageLimit);

  // If currCount is beyond last page, clamp it
  if (currCount > totalPages) {
    setCurrCount(totalPages);
    return;
  }

  // Compute slice indices
  const start = (currCount - 1) * pageLimit;
  const end = currCount * pageLimit;

  const newPage = sites.slice(start, end);

  setCurrPage(newPage);

}, [currCount, sites, pageLimit]);


  function addSite(name,site){
    if(mode){
      for(let i=0;i<selected.length;i++) if(selected[i][0] == name) return;
      setSelected([...selected,[name,site]])
      console.log("added",selected.length)
    }else{
      alert("Summary in progress! Can not select sites right now")
    }
  }

  function SelectedSite({name,site}){
    return (
      <div className="selectedSite" onClick={()=>{
        if(window.confirm("Do you want to remove this site?")){
        setSelected(prev => prev.filter(el => el[0] !== name))
        }
      }}>
        <h3>{name}</h3>
      </div>
    )
  }
  
  function callSummary(){
    if(selected.length < 2){
      alert("Select some sites first!");
      return;
    }
    if(selected.length > 3){
      alert("Three sites maximum!")
      return;
    }
    if(!mode){
      alert("Summary is in progress! Can not summarize now.")
      return;
    }
    setMode(0)
    setClone(selected);
    setSelected([]);
    setSum(["Loading..."])
    fetch("http://localhost:2000/api/summary",{
      method: "POST",
      headers:{
            "Content-Type": "application/json"
      },
      body: JSON.stringify({value:clone})
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response Given from port.")
      let hold = data.data
      hold = hold.split("\n");
      setSum(hold);
      setMode(1)
    })
    .catch(err=>{
      console.log("Error" + err)
      alert("Sorry there was an error!")
      setMode(1);
    })
  }

  function update(){
    if(isUpdate){
      changeUpdateStatus(0);
      console.log("staring update")
      document.getElementById("inputControl").disabled = true;
      fetch("http://localhost:2000/api/update",{
        method:"POST",
        headers:{
              "Content-Type": "application/json"
        },
        body: JSON.stringify({value:1})
      })
      .then(response => response.json())
      .then(data => {
        changeUpdateStatus(1)
        console.log("Update Complete")
        alert("All articles updated")
        document.getElementById("inputControl").disabled = false;
      })
      .catch(err => {
        changeUpdateStatus(1)
        alert("Something went wrong")
        document.getElementById("inputControl").disabled = false
      })
    }else{
      alert("An update is already in progress!")
    }
    
  }

  return (
    <>
    <div id="mainLayout">
      <div id="pageWrapper">
        <div id="formRow">
    <article id="formContent">
          <form className='form' onSubmit={handleSubmit}>
              <div className='form-control'>
                  <input 
                      id="inputControl"
                      type='text'
                      name='firstName'
                      value={name}
                      onChange={(e)=>setName(e.target.value)}
                  />
              </div>
              <br></br>

          </form>
    </article>
    

    </div>

    <section id="siteContainer">
      {
        currPage.map(Element=>{
          return SiteItem({name: Element[0], site: Element[1]})
        })
      }
        
    </section>
    <section id="PageControl">
      <button onClick={()=>setCurrCount(currCount - 1)}>← Previous Page</button>
      <button onClick={()=>setCurrCount(currCount + 1)}>Next Page →</button>
      <button onClick={()=>{update()}}>Update Articles</button>
    </section>

      </div>

      <div id="selectContainer">
        <div id="selected">
          <h2>Selected</h2>
          {
            selected.map(Element=>{
              return SelectedSite({name:Element[0],site:Element[1]})
            })
          } 
        </div>
        <br></br>
        <button id="SelectedSubmit" onClick={()=>{
          callSummary()
        }}>Generate Summary</button>
      </div>
    </div>
    <div id="summaryContainer">
      <h2>Summary:</h2>
      {
        sumText.map(Element=> {
          return (
            <>
            <p>{Element}</p>
            <br></br>
            </>
          )
        })
      }
    </div>
    </>
  )
}

function App() {
    return (
        <>
        <ControlledInputs />
        </>
    )

}

export default App;
