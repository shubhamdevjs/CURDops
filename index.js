const taskContainer = document.querySelector(".task_container");
let globalstorage = [];

const countryStateInfo = {
  USA: {
    California: ["Los Angeles", "San Diego", "San Jose", "Sacramento"],
    Texas: ["Dallas", "Austin", "Houston", "San Antonio"],
    Florida: ["	Jacksonville", "	Miami", "Miami"],
    Alaska: ["	Fairbanks", "	Juneau", "Badger", "	Knik-Fairview"],
  },
  England: {
    Massachusetts: ["Salem", "Plymouth", "Cambridge", "Worcester"],
    Connecticut: ["Hartford", "New Haven", "Stamford", "Bridgeport"],
    Vermont: ["Burlington", "Montpelier", "Stowe", "Woodstock"],
    Scotland: ["Glasgow", "Dundee", "Edinburg", "Perth"],
  },
  India: {
    Bihar: ["Patna", "Gaya", "Nalanda", "Darbhanga"],
    Punjab: ["Amritsar", "Patiala", "Jalandhar", "Ludhiana"],
    Maharashtra: ["	Mumbai", "Pune", "Nashik", "Kolhapur"],
    Gujarat: ["	Ahmedabad", "	Surat", "Vadodra", "Gandhinagar"],
  },
};
//todo: Get all input html elements from the DOM.
const countrySelection = document.querySelector("#Country");
const stateSelection = document.querySelector("#State");
const citySelection = document.querySelector("#City");

stateSelection.disabled = true; // remove all options bar first
citySelection.disabled = true; // remove all options bar first

for (let country in countryStateInfo) {
  countrySelection.options[countrySelection.options.length] = new Option(
    country,
    country
  );
}

countrySelection.onchange = (e) => {
  stateSelection.disabled = false;
  
  for (let state in countryStateInfo[e.target.value]) {
    stateSelection.options[stateSelection.options.length] = new Option(
      state,
      state
    );
  }
};

stateSelection.onchange = (e) => {
  citySelection.disabled = false;

  citySelection.length = 1; // remove all options bar first

  let cities = countryStateInfo[countrySelection.value][e.target.value];

  console.log(e.target.value);
  for (let i = 0; i < cities.length; i++) {
    citySelection.options[citySelection.options.length] = new Option(
      cities[i],
      cities[i]
    );
  }
};
// };

const generateHTMlcode = (getdata) => {
  return ` <div  id=${getdata.id} class="usercontainer">
  <div class="usercontent">
    
    <div >
    <p class="userid"> user id: ${getdata.id}</p>
      <p >${getdata.fullname}</p>
      <p >${getdata.email}</p>
      <p >${getdata.dateofbirth}</p>
      <p >${getdata.hobby}</p>
      <p >${getdata.country}</p>
      <p >${getdata.state}</p>
      <p >${getdata.city}</p>
      
    </div>
    <div>
      <button  name="${getdata.id}" onclick="deleteCard.apply(this, arguments)">delete</button>
      <button  name="${getdata.id}" onclick="editCard.apply(this, arguments)">edit</button>    
    </div>
  </div>
</div>`;
};
const inserttoDOM = (content) =>
  taskContainer.insertAdjacentHTML("beforeend", content);

const saveToLocalStorage = () =>
  localStorage.setItem("tasky", JSON.stringify({ card: globalstorage }));
const addCard = () => {
  //receiving data from the website
  const getdata = {
    id: `${Date.now()}`,
    fullname: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    dateofbirth: document.getElementById("dateofBirth").value,
    hobby: document.getElementById("hobby").value,
    country: document.getElementById("Country").value,
    state: document.getElementById("State").value,
    city: document.getElementById("City").value,
  };
  if (
    getdata.email &&
    getdata.fullname &&
    getdata.dateofbirth &&
    getdata.hobby &&
    getdata.country &&
    getdata.state &&
    getdata.city != null
  ) {
    globalstorage.push(getdata);
    saveToLocalStorage();
    htmlCode(getdata);
  } else {
    console.log(getdata);
    window.alert("please fill all the details");
  }

  return;
};

//generate html code
const htmlCode = (getdata) => {
  const newcard = generateHTMlcode(getdata);

  inserttoDOM(newcard);

  //clear modal

  document.getElementById("fullName").value = " ";
  document.getElementById("email").value = " ";
  document.getElementById("dateofBirth").value = " ";
  document.getElementById("hobby").value = " ";
  document.getElementById("Country").value = " ";
  document.getElementById("State").value = " ";
  document.getElementById("City").value = " ";

  return;
};

const loadExistingData = () => {
  const getData = localStorage.getItem("tasky");

  if (!getData) return;

  const taskcards = JSON.parse(getData);

  globalstorage = taskcards.card;

  globalstorage.map((getdata) => {
    const newcard = generateHTMlcode(getdata);

    inserttoDOM(newcard);
  });

  return;
};

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTask = globalstorage.filter((task) => task.id !== targetID);
  globalstorage = removeTask;
  window.alert("User will be deleted !");

  saveToLocalStorage();

  // access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editCard = () => {
  const elementType = event.target.tagName;
  window.alert("Double click on the text where you want to edit !");

  let curdName;
  let curdEmail;
  let curdDate;
  let curdHobby;
  let taskDescription;
  let parentElement;
  let submitButton;

  if (elementType == "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    event.target.parentNode.parentElement.parentNode;
  }
  console.log(parentElement.childNodes[1].childNodes);

  curdName = parentElement.childNodes[1].childNodes[3];
  curdEmail = parentElement.childNodes[1].childNodes[5];
  curdDate = parentElement.childNodes[1].childNodes[7];
  curdHobby = parentElement.childNodes[1].childNodes[9];
  submitButton = parentElement.childNodes[3].childNodes[3];

  curdName.setAttribute("contenteditable", "true");
  curdEmail.setAttribute("contenteditable", "true");
  curdDate.setAttribute("contenteditable", "true");
  curdHobby.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save changes";
};

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType == "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    event.target.parentNode.parentElement.parentNode;
  }
  console.log(parentElement.childNodes[1].childNodes[3]);

  curdName = parentElement.childNodes[1].childNodes[1];
  curdEmail = parentElement.childNodes[1].childNodes[3];
  curdDate = parentElement.childNodes[1].childNodes[5];
  curdHobby = parentElement.childNodes[1].childNodes[7];
  submitButton = parentElement.childNodes[3].childNodes[3];

  const updateData = {
    name: curdName.innerHTML,
    email: curdEmail.innerHTML,
    date: curdDate.innerHTML,
    hobby: curdHobby.innerHTML,
  };

  const updateGlobalStorage = globalstorage.map((task) => {
    if ((task.id = targetID)) {
      return { ...task, ...updateData };
    }
    return task;
  });

  globalstorage = updateGlobalStorage;

  saveToLocalStorage();

  curdName.setAttribute("contenteditable", "false");
  curdEmail.setAttribute("contenteditable", "false");
  curdDate.setAttribute("contenteditable", "false");
  curdHobby.setAttribute("contenteditable", "false");
  submitButton.setAttribute("onclick", "editCard.apply(this, arguments)");
  submitButton.innerHTML = "Edit";
};
