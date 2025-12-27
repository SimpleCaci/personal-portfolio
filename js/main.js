//global variables
let projects;

//to grab and parse the JSON file
async function grabData(dataName) {
    const requestURL = "../data/"+dataName+".json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const data = await response.json();
 
    console.log("Data loaded:", data)

    return data;
}

//to populate projects
function populateProject(obj) {
    const section = document.querySelector(".current-items-section");
    const myH1 = document.createElement("h1");
    myH1.textContent = obj.title;
    section.appendChild(myH1);

    const myPara = document.createElement("p");
    myPara.textContent = `Disc: ${obj.description} // Status: ${obj.status}`;
    section.appendChild(myPara);
}



// async usage
(async function () {
    const data = await grabData("projects");
    projects = data.projects;
    for (const project of projects){ // javascript uses "of" to grab the elements and "for" to grab indices
        populateProject(project);
    }
})();

