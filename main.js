import axios from "axios";
import { config } from "./config/config";
import { v4 as uuidv4 } from "uuid"; // Assuming you use the 'uuid' library to generate unique ids

const getData = async (url) => {
  try {
    const response = await axios(`${url}/formElements`);
    return response.data;
  } catch (error) {
    console.log("Error in getting data", error);
  }
};

const addData = async (payload) => {
  try {
    const response = await axios.post(
      `${config.api_url}/formElements`,
      payload
    );
    return response.data;
  } catch (error) {
    console.log("Error in adding element");
  }
};

// Function to create an element node with proper label and form element (input, select, textarea)
const createElementsNode = ({
  id,
  element,
  type,
  placeholder,
  label,
  options,
  name,
  value,
}) => {
  // Create a div to contain the label and form element
  const elementDiv = document.createElement("div");
  elementDiv.classList.add("form-element");

  const elementConfigDiv = document.createElement("div");
  elementConfigDiv.classList.add("element-config");
  elementConfigDiv.id = id;

  const editIcon = document.createElement("i");
  editIcon.classList.add(
    "fa-regular",
    "fa-pen-to-square",
    "element-config-button"
  );
  editIcon.title = "Edit"; // Adding tooltip

  const dragIcon = document.createElement("i");
  dragIcon.classList.add(
    "fas",
    "fa-arrows-alt",
    "drag-icon",
    "element-config-button"
  );
  dragIcon.title = "Drag"; // Adding tooltip

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(
    "fas",
    "fa-trash",
    "delete-icon",
    "element-config-button"
  );
  deleteIcon.title = "Delete"; // Adding tooltip

  elementConfigDiv.append(editIcon, dragIcon, deleteIcon);
  elementDiv.appendChild(elementConfigDiv);
  // Create the label
  const elementLabelWrapper = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.innerText = label;
  labelElement.for = id;
  elementLabelWrapper.appendChild(labelElement);

  let formElement;

  // Dynamically create form elements based on the `type`
  switch (element) {
    case "input":
      if (type === "text") {
        formElement = document.createElement("input");
        formElement.type = "text";
        formElement.placeholder = placeholder;
        formElement.id = id;
        formElement.name = name;
      } else if (type === "number") {
        formElement = document.createElement("input");
        formElement.type = "number";
        formElement.placeholder = placeholder;
        formElement.id = id;
        formElement.name = name;
      } else if (type === "checkbox") {
        formElement = document.createElement("input");
        formElement.type = "checkbox";
        formElement.value = value;
        formElement.id = id;
        formElement.name = name;
      }
      break;

    case "textarea":
      formElement = document.createElement("textarea");
      formElement.placeholder = placeholder;
      formElement.id = id;
      formElement.name = name;
      break;

    case "select":
      formElement = document.createElement("select");
      formElement.id = id;
      formElement.name = name;
      options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.innerText = optionText;
        formElement.appendChild(option);
      });
      break;

    default:
      formElement = null; // Handle invalid types if needed
  }

  if (formElement) {
    elementLabelWrapper.appendChild(formElement); // Append the form element inside the div
  }
  elementDiv.appendChild(elementLabelWrapper);
  return elementDiv; // Return the complete div with label and form element
};

// Get form elements and render them
const getElementsNodes = async () => {
  try {
    const formElementsData = await getData(config.api_url);
    console.log("formElements", formElementsData);

    // Clear previous form elements (if any)
    const formContainer = document.getElementById("form-area");
    formContainer.innerHTML = "";

    // Map over form elements data and append the created elements to the UI
    formElementsData.forEach((eleObj) => {
      const elementNode = createElementsNode(eleObj);
      if (elementNode) {
        formContainer.appendChild(elementNode);
      }
    });
  } catch (error) {
    console.log("Error in getting form elements nodes", error);
  }
};

// Fetch and render all form elements on the UI
const getAllFormElements = async () => {
  try {
    await getElementsNodes();
  } catch (error) {
    console.log("Error in getting all form elements", error);
  }
};

const addElementToForm = async (elementType) => {
  let formElementObj = {};

  switch (elementType) {
    case "Text":
      formElementObj = {
        id: uuidv4(),
        element: "input",
        type: "text",
        label: "Sample Text Input",
        placeholder: "Enter text here",
        name: "textInputName",
      };
      break;

    case "Number":
      formElementObj = {
        id: uuidv4(),
        element: "input",
        type: "number",
        label: "Sample Number Input",
        placeholder: "Enter number here",
        name: "numberInputName",
      };
      break;

    case "Checkbox":
      formElementObj = {
        id: uuidv4(),
        element: "input",
        type: "checkbox",
        label: "Sample Checkbox",
        placeholder: "",
        name: "checkboxName",
        value: "checkboxValue",
      };
      break;

    case "Select":
      formElementObj = {
        id: uuidv4(),
        element: "select",
        type: "none",
        label: "Sample Select",
        options: ["Sample Option 1", "Sample Option 2", "Sample Option 3"],
        name: "selectName",
      };
      break;

    case "Textarea":
      formElementObj = {
        id: uuidv4(),
        element: "textarea",
        type: "none",
        label: "Sample Textarea",
        placeholder: "Enter text here",
        name: "textareaName",
      };
      break;

    default:
      console.log("Invalid element type");
  }

  try {
    const response = await addData(formElementObj);
    console.log("Sucessfully add element", response);
    await getAllFormElements();
  } catch (error) {
    console.log("Error in adding element ...");
  }
};

const componentList = document.querySelector(".component-list");

function createSidebarComponentList() {
  // Select the component-list div where elements will be appended

  // Create the Input button with dropdown icon
  const inputButton = document.createElement("button");
  inputButton.className = "component-btn";
  inputButton.id = "inputDropdownBtn";
  inputButton.textContent = "Input";

  const dropdownIconSpan = document.createElement("span");
  dropdownIconSpan.id = "add-inputTag-dropdownIcon";

  const dropdownIcon = document.createElement("i");
  dropdownIcon.className = "fa-solid fa-angle-down";

  dropdownIconSpan.appendChild(dropdownIcon);
  inputButton.appendChild(dropdownIconSpan);

  // Append the Input button to the component list
  componentList.appendChild(inputButton);

  // Create the dropdown content for Input
  const dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-content";
  dropdownContent.id = "inputDropdown";

  inputButton.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
    dropdownIconSpan.innerHTML = `<i class="fa-solid fa-angle-up"></i>`;
    if (!dropdownContent.classList.contains("show")) {
      dropdownIconSpan.innerHTML = `<i class="fa-solid fa-angle-down"></i></i>`;
    }
  });

  // Dropdown items data
  const dropdownItems = [
    { type: "Text", icon: "+" },
    { type: "Number", icon: "+" },
    { type: "Checkbox", icon: "+" },
  ];

  // Create and append each dropdown item
  dropdownItems.forEach((item) => {
    const dropdownItem = document.createElement("div");
    dropdownItem.className = "dropdown-item";
    dropdownItem.textContent = item.type;

    const iconSpan = document.createElement("span");
    iconSpan.className = "icon";
    iconSpan.textContent = item.icon;

    dropdownItem.addEventListener("click", () => {
      addElementToForm(item.type);
    });

    dropdownItem.appendChild(iconSpan);
    dropdownContent.appendChild(dropdownItem);
  });

  // Append the dropdown content to the component list
  componentList.appendChild(dropdownContent);

  // Create and append Select button
  const selectButton = document.createElement("button");
  selectButton.className = "component-btn";
  selectButton.textContent = "Select";
  selectButton.innerHTML += " <span>+</span>"; // Adding the plus sign
  selectButton.addEventListener("click", () => {
    addElementToForm("Select");
  });

  componentList.appendChild(selectButton);

  // Create and append Textarea button
  const textareaButton = document.createElement("button");
  textareaButton.className = "component-btn";
  textareaButton.textContent = "Textarea";
  textareaButton.innerHTML += " <span>+</span>"; // Adding the plus sign
  textareaButton.addEventListener("click", () => {
    addElementToForm("Textarea");
  });

  componentList.appendChild(textareaButton);
}

createSidebarComponentList();

const inputDropdown = document.getElementById("inputDropdown");
const inputDropdownIconSpan = document.getElementById(
  "add-inputTag-dropdownIcon"
);
window.addEventListener("click", (event) => {
  if (!event.target.matches(".component-btn")) {
    if (inputDropdown.classList.contains("show")) {
      inputDropdown.classList.remove("show");
    }
    inputDropdownIconSpan.innerHTML = `<i class="fa-solid fa-angle-down"></i></i>`;
  }
});

// Call the function to get and render form elements on page load
getAllFormElements();
