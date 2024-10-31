# ISI Assignment 3
## Login System
- Create a login screen using React (with Vite) with the following pointers in mind:
    - The user should enter a valid username and password.
    - If either of the fields is missing, an appropriate error message should be shown.
    - Upon logging in successfully, the user should be redirected to a separate page.
    - In case the credentials are incorrect, an appropriate error message should be shown.
- The codebase should be maintained in GitHub
- The API request/response flow should be implemented using Axios package
- Try and implement a mock JSON functionality to simulate data being received from the backend

## Landing Page
- Create a landing page called Dashboard. Once the user logs in successfully they will be redirected to this page.
- This page should have a left side menu that has a menu item for Dashboard. This item, when clicked, redirects the user to the same page.
- This page should also have a navbar at the top. At the far right of the navbar, there should be an option for Logout.

- Apart from this, you are to create an account on Vercel (Plan Type: Hobby), to deploy the HTML and CSS website that you made earlier. The method of deployment (via GitHub or directly through Vercel's interface) is up to you.

## User Management
- Add an eye icon to the password field to enable password visibility feature during login. It can be enabled or disabled upon clicking the same icon.
- Upon logging in, create a new entry for Users in the sidebar, below Dashboard.
- Clicking on that item will open a Users page, where a datatable will be displayed. It will have 4 column (ID, Name, Email, Action)
- The ID field will have a sequential numbering for all the user rows displayed in that table. This value will not be the one stored in your JSON file, but dynamically generated while displaying the rows.
- The action field will have 3 buttons (or icons), for 3 different operations, namely View, Update and Delete.
- The Add User button should be placed at the top right corner of the datatable.
- A modal component should be used to display or capture form data for the View/Add/Update operations.
- Do not show password fields for View/Update operations.
- Users should be able to upload an image file (maximum size 500 KB) during Add/Update operation. The image should be visible during View operation. In case the image is not available show an appropriate message.
