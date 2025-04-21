# Proggressive Life
## Video Demo:  <URL HERE>
## Description:

This is a full-stack project which uses Flask for the backend, along with it's SQLAlchemy library to connect with the database of the project called finalproyect.db, and uses React for the frontend. The project is based on CRUD functions to show your progress school and training wise. The main sections of this project are **Account** and **Todo list**

Inside Account, you have progress bars measuring your school and training progress. The school progress is based on your exams grades and training progress is based on the duration of your trainings. There's also a profile image displayed depending on your progress percentage.

Inside the Todo List, you can create tasks, group them by section, update their priority, set their date, complete them and delete them.

## Cross-Origin error

The first file we need to take into account is **vite.config.js**, in this file i had to configure the react proxy to handle requests from the backend as i was dealing with **cross-origin** issues. In proxy i defined **"/api"** as **"http://127.0.0.1:5000"** which is the url used for the backend, and that way react will be able to handle request from it.

## Backend

### config.py

In this file i setup the secret key and the database URI for the project. I didn't know how to handle authentification using react with flask, that's why i took inspiration from this guide: https://www.youtube.com/watch?v=sBw0O5YTT4Q, and used JWT (JSON Web Tokens ) to store user information and exchange it between frontend and backend.

### models.py

In this file i defined the tables for the project's database. Each table has it's id which helps me connect data inside the database. For example, each **section** has an **id**, and each **todo** has a **section_id**, with this i can group todos inside sections as long as the section **id** coincides with the **section_id** from the todo. I also realized that in order to pass data to React from Flask database, i have to convert the table data to JSON format, that's why each table has a **to_json** function but the User table, that's because User data is passed to JSON format in **app.py** after it has been checked that the used is logged in.

### app.py

In this file i handle all the backend functions and connect with the frontend for the web app to work. We can see all functions have route as "/api/*", that's because we previously defined "/api" as "http://127.0.0.1:5000" in the vite.config.js file and this allows us to pass down information between frontend and backend by accessing the route's url. 

#### Authentification

The three main functions inside **app.py** to handle authentification are **register**, **login** and **protected**. 

Inside **register** it requests basic user info from the frontend with the **request.json.get()** function, and makes some checks on the info. After, it hashed the password for security issues and stores the info along with the hashed password in the database using **db.session.add()** and **db.session.commit()**.

Due to potential issues or bugs, everytime i add or delete something from the database, i use **try** function along with **except**, and send the error messages to the frontend. This way we avoid errors when handling data and it made debugging more easy.

Inside **login** it checks that the user existed and that the password matched the unhashed password. It also stores user info the the json web token and sends it to the frontend.

Finally, **protected** checks if the user is currently logged in and if so, it send user info to the frontend, however if the session expired, it sends and error message.

#### CRUD

The rest of the functions inside **app.py** are based in CRUD (create, read, update, delete).

##### Create

For create functions, we use the **POST** method, as we are sending data to the frontend.

Inside create functions, they access the current user id using **get_jwt_identity()**, so the data created has it's user_id as the current user's id.

Also for data that is connected to other tables, such as **Todos** which is connected to **TodoSections**, it filters for the section inputted by the user in order to match the todo to the section group by matching the section id to the todo's section_id.

##### Read

In order to read data in the frontend, we need to **get** the data from the database, that's why we have functions with method **GET**.

Inside this functions we check for the data from the user using the current user's id, and we create a list of the data by using **list(map())**. For example, inside **get_todos()**, before passing the data to the frontend there's this line of code: **todo_list = list(map(lambda todo: todo.to_json(), todos))**, which takes each data from the table and converts it to json format using the defined function inside the table.

##### Update

For update functions, we use the **PATCH** method, as we are changing existing data.

Inside update functions, it filters for the data that it is going to update using **.query.filter_by().first**. And always after changing data, we have to call **db.session.commit()**.

##### Delete

For delete functions, we use the **DELETE** method, as we are removing existing data.

Inside this functions we just filter for the data that we want to delete, and call for **db.session.delete()** function .

## Frontend

Throughout the files there are many imports from fortawesome, this is beacuse i have decided to use icon form fortawesome as they contain a variety of choices with multiple designs that helps user experience.

I have also chosen to use axios library for react as it makes request easier and faster to write, optimizing the code. 

### Usercontext.jsx

Inside this file, i used the createContext from react which helps me pass information throughout the different files inside the frontend. 

I used this file to create functions and useStates that are commonly used and repeated throughout the files, even functions that are only used once, this is because by having most of the functions and useStates in one file, it helps clean and make easier to read the other files.

A commonly repeated function is the fetch function, in this file we can see fetchUser, fetchSections, fetchTodos... These are functions that **get** information from the backend by accessing the URL stated in the backend for **get** functions using **axios.get**. After obtaining the information i either store it in sessionStorage like user info, or store it in a useState. I decided to store user info in sessionStorage as it's data is only accessible if the session is active.

I also created a function called **axiosRequest**, this is because i noticed that with axios i had to state the headers everytime i called it, so i created this function that already states the headers, and if i need to do axios requests in other files, i don't need to state them every time i use it.

Finally, the main useStates from this file are the **todos** and **todoItem**, todos contains all the todos from the users, and this is widely used in other files such us TodoList to show them up, and todoItem is used everytime i want to update a todo, as it is a dictionary that contains data for every property that the todo data table has.

### Account.jsx

This file contains all the functions and components from the Account section of the web application. 

The first items inside Account function are useStates, used to store information. I also used some useStates with value false, this helped me show HTML components after a button was clicked, for example, in line **765** there's an icon that has a property **onClick**, which sets the showTraining useState to the opposite value, so if it was false, if the icon is clicked it changes to true, and this value is used after in line **781** to show a <div> if showTraining is true.

In this sections there are three progress bars, a general progress bar, one for school and one for training. The general progress bar shows the current progress by calculating the average between school and training progress, using **Math.round()**. 

Inside the school progress bar we can expand it to see a panel containing our classes. A class can be created by pressing the **Add Class** button which calls for the create_class() function, and this function makes an **axiosRequest** to the backend using **post** method and passing down the name of the class. Each class can be editted, configured, or deleted. The edit button shows and input to change the name of the class and when **Save** is pressed it calls for **update_class** which makes an axios request using **patch** passing down the new name form the input of the user. The delete button calls for **delete_class()** which makes an axios request using **delete** method passing down the class id. Finally, the configure button opens up a new panel in which we can create and delete terms, using similar functions as the ones for creating and deleting classes, and inside each term we can create exams, and each exam can be updated by name, date and grade, and they can also be deleted. Also the grades of the exams are shown in different colors depending on the grade, if the grade is barely passed or less, it shows up in red, if the grade is between passed and 80%, it shows up in orange, and if it's more than 80% it shows up in green.
Finally, the progress of school is calculated by using the **calculate_school** function, which uses the sum of the grade of each exam divided by the maximum obtainable grade multiplied by 10, so the grades are based on 10 as maximum grade. It also keeps track of the number of exams using the variable length and then returns the sum divided by length multiplied by 10. Also, each class has it's own progress bar and it is calculated in the same way but only containing exams from the class.

The training progress bar is very similar to the school progress bar, only difference is that training progress is based on duration instead of grade. It is calculated by taking the sum of the duraton of all training sessions divided by the number of sessions and divided by 1.5, meaning that the optimal duration for each sesssion is 1 hour 30 minutes. Finally it is multiplied by 100 for a percentage value. 


Finally, there is a profile image that shows a different image depending on the current progress. In total there are 4 profile images that can show up depending one the average of school and training progress.