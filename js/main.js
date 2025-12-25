//global variables
let data;

//to grab and parse the JSON file
async function grabData(dataName) {
    const requestURL = "../data/"+dataName+".json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const data = await response.json();

    console.log("Data loaded:", data)

    return data;
}

function populateHeader(obj) {
    const header = document.querySelector("header");
    const myH1 = document.createElement("h1");
    myH1.textContent = obj.squadName;
    header.appendChild(myH1);

    const myPara = document.createElement("p");
    myPara.textContent = `Hometown: ${obj.homeTown} // Formed: ${obj.formed}`;
    header.appendChild(myPara);
}