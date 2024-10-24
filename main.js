import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config/config";

const baseUrl = `${config.api_url}/formElements`;

const getData = async (url) => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

const addData = async (payload) => {
  try {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  } catch (error) {
    console.error("Error adding data:", error);
    throw new Error(`Failed to add data: ${error.message}`);
  }
};

const deleteData = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error(`Failed to delete data: ${error.message}`);
  }
};

const replaceData = async (newArrangedDataArr) => {
  try {
    const response = await axios.put(baseUrl, newArrangedDataArr);
    return response.data;
  } catch (error) {
    console.error("Error replacing data:", error);
    throw new Error(`Failed to replace data: ${error.message}`);
  }
};

const updateData = async (id, updatedElement) => {
  try {
    const response = await axios.patch(`${baseUrl}/${id}`, updatedElement);
    return response.data;
  } catch (error) {
    throw new Error(`Error in upating element: ${error.message}`);
  }
};

const deleteElementById = async (id) => {
  try {
    const response = await deleteData(id);
    console.log("Element deleted successfully", response);
    await getAllFormElements();
  } catch (error) {
    console.log("Error in deleting element", error);
  }
};

const modal = document.getElementById("editModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeBtn = document.querySelector(".close");
const saveChangesButton = document.getElementById("saveChangesButton");
const editForm = document.getElementById("editForm");

let currentElementObject = null;

const openModal = (elementObject) => {
  currentElementObject = elementObject;

  editForm.innerHTML = "";
  for (const key in elementObject) {
    if (
      elementObject.hasOwnProperty(key) &&
      elementObject[key] !== null &&
      elementObject[key] !== undefined
    ) {
      const inputWrapper = document.createElement("div");

      const label = document.createElement("label");
      label.innerText = key[0].toLocaleUpperCase() + key.substring(1);
      inputWrapper.appendChild(label);

      if (key === "options") {
        const optionWrapper = document.createElement("div");
        optionWrapper.id = "optionWrapperInEdit";

        elementObject.options?.forEach((option, index) => {
          const optionDiv = document.createElement("div");
          const input2 = document.createElement("input");
          input2.type = "text";
          input2.name = key;
          input2.value = option;

          const removeOptionBtn = document.createElement("button");
          removeOptionBtn.innerText = "-";
          removeOptionBtn.onclick = () => {
            optionWrapper.removeChild(optionDiv);
            elementObject.options.splice(index, 1);
          };

          optionDiv.appendChild(input2);
          optionDiv.appendChild(removeOptionBtn);
          optionWrapper.appendChild(optionDiv);
        });

        const addMoreOptionBtn = document.createElement("button");
        addMoreOptionBtn.innerText = "+ Add Option";
        addMoreOptionBtn.onclick = () => {
          const newOptionDiv = document.createElement("div");
          const input3 = document.createElement("input");
          input3.type = "text";
          input3.placeholder = "New option";
          input3.name = key;

          const removeNewOptionBtn = document.createElement("button");
          removeNewOptionBtn.innerText = "-";

          newOptionDiv.appendChild(input3);
          newOptionDiv.appendChild(removeNewOptionBtn);
          optionWrapper.appendChild(newOptionDiv);

          removeNewOptionBtn.onclick = () => {
            optionWrapper.removeChild(newOptionDiv);
            elementObject.options.pop();
          };

          elementObject.options.push("Sample Option");
          inputWrapper.append(optionWrapper, addMoreOptionBtn);
        };
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.name = key;
        input.value = elementObject[key];
        if (key === "element" || key === "type" || key === "id") {
          input.readOnly = true;
          input.disabled = true;
        }
        inputWrapper.appendChild(input);
      }

      editForm.appendChild(inputWrapper);
    }
  }

  modal.style.display = "block";
  modalOverlay.style.display = "block";
};

const closeModal = () => {
  modal.style.display = "none";
  modalOverlay.style.display = "none";
};

closeBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", closeModal);

saveChangesButton.addEventListener("click", async () => {
  const formData = new FormData(editForm);
  formData.forEach((value, key) => {
    currentElementObject[key] = value;
  });

  try {
    const response = await updateData(
      currentElementObject.id,
      currentElementObject
    );
    console.log("Element updated successfully:", response);
    await getAllFormElements();
  } catch (error) {
    console.error("Error updating element:", error);
  }

  closeModal();
});

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
  const elementDiv = document.createElement("div");
  elementDiv.classList.add("form-element", "draggable-div");
  elementDiv.draggable = true;

  const elementLabelWrapper = document.createElement("div");
  const labelElement = document.createElement("label");
  labelElement.innerText = label;
  labelElement.for = id;
  elementLabelWrapper.appendChild(labelElement);

  let formElement;

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
        elementLabelWrapper.style.display = "flex";
        elementLabelWrapper.style.alignItems = "center";
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
      formElement = null;
  }

  if (formElement) {
    elementLabelWrapper.appendChild(formElement);
  }
  elementDiv.appendChild(elementLabelWrapper);

  const elementConfigDiv = document.createElement("div");
  elementConfigDiv.classList.add("element-config");
  elementConfigDiv.id = id;

  const editIcon = document.createElement("i");
  editIcon.classList.add(
    "fa-regular",
    "fa-pen-to-square",
    "element-config-button"
  );
  editIcon.title = "Edit";

  let isListenerAttached = false;

  if (!isListenerAttached) {
    editIcon.addEventListener("click", function () {
      openModal({
        id,
        element,
        type,
        placeholder,
        label,
        options,
        name,
        value,
      });
    });
    isListenerAttached = true;
  }

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(
    "fas",
    "fa-trash",
    "delete-icon",
    "element-config-button"
  );
  deleteIcon.title = "Delete";

  deleteIcon.addEventListener("click", () => deleteElementById(id));

  elementConfigDiv.append(editIcon, deleteIcon);
  elementDiv.appendChild(elementConfigDiv);

  return elementDiv;
};

const getElementsNodes = async () => {
  try {
    const formElementsData = await getData(config.api_url);

    const formContainer = document.getElementById("form-area");
    formContainer.innerHTML = "";

    let draggedItem = null;
    let currentAfterElement = null;

    formElementsData.forEach((eleObj) => {
      const elementNode = createElementsNode(eleObj);
      if (elementNode) {
        formContainer.appendChild(elementNode);
      }
    });

    formContainer.addEventListener("dragstart", (e) => {
      draggedItem = e.target;
      e.target.classList.add("dragging");
    });

    formContainer.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
      draggedItem = null;

      if (currentAfterElement) {
        currentAfterElement.classList.remove("highlight");
        currentAfterElement = null;
      }
    });

    formContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(formContainer, e.clientY);
      const dragging = document.querySelector(".dragging");

      if (afterElement && afterElement !== currentAfterElement) {
        if (currentAfterElement) {
          currentAfterElement.classList.remove("highlight");
        }
        afterElement.classList.add("highlight");
        currentAfterElement = afterElement;
      } else if (!afterElement && currentAfterElement) {
        currentAfterElement.classList.remove("highlight");
        currentAfterElement = null;
      }

      if (afterElement == null) {
        formContainer.appendChild(dragging);
      } else {
        formContainer.insertBefore(dragging, afterElement);
      }
    });

    function getDragAfterElement(formContainer, y) {
      const draggableElements = [
        ...formContainer.querySelectorAll(".draggable-div:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }
  } catch (error) {
    console.log("Error in getting form elements nodes", error);
  }
};

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
        options: [], // Consistency with Select
        value: null, // Consistency with Checkbox
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
        options: [],
        value: null,
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
        options: [],
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
        placeholder: null, // Select doesn't need placeholder
        value: null, // Consistency with Checkbox
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
        options: [], // Consistency with Select
        value: null, // Consistency with Checkbox
      };
      break;

    default:
      console.log("Invalid element type");
  }

  try {
    const response = await addData(formElementObj);
    console.log("Successfully added element", response);
    await getAllFormElements();
  } catch (error) {
    console.log("Error in adding element", error);
  }
};

const componentList = document.querySelector(".component-list");

function createSidebarComponentList() {
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

  componentList.appendChild(inputButton);

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

  const dropdownItems = [
    { type: "Text", icon: "+" },
    { type: "Number", icon: "+" },
    { type: "Checkbox", icon: "+" },
  ];

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

  componentList.appendChild(dropdownContent);

  const selectButton = document.createElement("button");
  selectButton.className = "component-btn";
  selectButton.textContent = "Select";
  selectButton.innerHTML += " <span>+</span>";
  selectButton.addEventListener("click", () => {
    addElementToForm("Select");
  });

  componentList.appendChild(selectButton);

  const textareaButton = document.createElement("button");
  textareaButton.className = "component-btn";
  textareaButton.textContent = "Textarea";
  textareaButton.innerHTML += " <span>+</span>";
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

getAllFormElements();

const saveBtn = document.getElementById("save-button");
saveBtn.addEventListener("click", saveCurrentUI);
const formContainer = document.getElementById("form-area");

async function saveCurrentUI() {
  const formElementsArr = document.querySelectorAll(".form-element");
  let newArrangedElementList = [];
  if (formElementsArr[0]) {
    formElementsArr.forEach((element) => {
      const label = element.querySelector("label")
        ? element.querySelector("label").innerText
        : null;

      const formElementType = element.querySelector("textarea")
        ? "textarea"
        : element.querySelector("select")
        ? "select"
        : element.querySelector("input")
        ? element.querySelector("input").type
        : null;

      let elementData = {};

      switch (formElementType) {
        case "textarea":
          const textarea = element.querySelector("textarea");
          elementData = {
            id: textarea.getAttribute("id"),
            name: textarea.getAttribute("name"),
            placeholder: textarea.getAttribute("placeholder"),
            label: label,
            type: null,
            element: "textarea",
            options: [],
            value: textarea.getAttribute("value"),
          };
          break;

        case "select":
          const select = element.querySelector("select");
          const options = Array.from(select.options).map(
            (option) => option.value
          );
          elementData = {
            id: select.getAttribute("id"),
            name: select.getAttribute("name"),
            label: label,
            options: options,
            type: null,
            element: "select",
            placeholder: select.getAttribute("placeholder"),
            value: select.getAttribute("value"),
          };
          break;

        case "checkbox":
        case "number":
        case "text":
          const input = element.querySelector("input");
          elementData = {
            id: input.getAttribute("id"),
            name: input.getAttribute("name"),
            placeholder: input.getAttribute("placeholder"),
            value: input.getAttribute("value"),
            label: label,
            type: input.getAttribute("type"),
            element: "input",
            options: [],
          };
          break;

        default:
          console.log("No recognizable form element found in the second div");
      }

      newArrangedElementList.push(elementData);
    });
    console.log("newArrangedElementList:OnSave:", newArrangedElementList);
    try {
      const response = await replaceData(newArrangedElementList);
      console.log("Rearrangement saved successfully", response);
      await getAllFormElements();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Form-element div not found");
  }
}
