# Form Builder App

This project is a visual form builder where users can create, edit, reorder, and delete form elements dynamically. The form is rendered using sample JSON data, and all CRUD operations are powered by `json-server`. The project also supports drag-and-drop reordering and has an intuitive user interface for easy customization of forms.

## 🚀 Live Demo

Check out the live project here: [Form Builder App](https://form-builder-app-sunbase.vercel.app/)

Checkout project explanation: [Demo vedio](https://drive.google.com/file/d/1iPWCU-Q3nwIb8Ac7Qy5q3lieWm6R-d8Z/view?usp=sharing)

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: JSON Server (for performing all CRUD operations)
- **Libraries**:
  - Vanilla JavaScript (DOM manipulation)
  - jQuery (optional, for certain operations)
  - Drag and Drop API (for reordering form elements)
- **Hosting**: Vercel

## ✨ Features

- **Add Form Elements**: Users can add new inputs, selects, or textareas to the form.
- **Reorder Elements**: Drag-and-drop functionality to reorder form elements dynamically.
- **Edit Form Fields**: Modify labels and placeholders for inputs and textareas.
- **Delete Elements**: Users can remove form fields with ease.
- **Save Form**: Log the updated form JSON to the devtools console upon saving.
- **Add/Delete Select Options**: Add or delete options within select elements.

## ⚙️ CRUD Functionality with JSON Server

This project uses `json-server` to handle all CRUD operations:

- **Create**: Add new form elements to the server.
- **Read**: Fetch the form data from the server to render the form.
- **Update**: Modify existing form elements, reorder them, or edit their properties.
- **Delete**: Remove form elements from the server.
- **Reorder**: Drag and drop any form element vertically and click save to get the new ordered Ui in console.

To start the server, follow these steps:

1. Install `json-server` globally: `npm install -g json-server`
2. Start the server: `json-server --watch db.json`
3. The app will connect to `http://localhost:8080` for CRUD operations.

## 📋 Assigned Tasks (Completed)

- **Create form elements (input, select, textarea)**
- **Reorder form elements using drag-and-drop**
- **Delete form elements**
- **Log updated form JSON in the console**
- **Modify input labels and placeholders**
- **Add and delete options for select fields**

## 🔗 Links

- **Live Demo**: [Form Builder App](https://form-builder-app-sunbase.vercel.app/)
- **GitHub Repository**: [GitHub Repo](https://github.com/krishnachaturvedi1901/form-builder-app-sunbase)

## 📷 Preview

Here’s a preview of the app’s interface:

![Form Builder Preview](https://ibb.co/Z8g7RzM)

## 📝 Instructions to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/krishnachaturvedi1901/form-builder-app-sunbase
   cd form-builder-app-sunbase
   npm install
   npm run dev
   ```
