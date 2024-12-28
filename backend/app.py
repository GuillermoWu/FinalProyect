from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Todos
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date
from flask_cors import CORS
from config import app, db 




@app.route('/api/get_todos', methods=['GET'])
@jwt_required()
def get_todos():
    today = date.today()
    today_date = today.strftime('%Y-%m-%d')
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])
        if not user:
            return jsonify({"nessage": "User not found"}), 404
        
        todos = Todos.query.filter_by(user_id=user.id).all()

        if todos:
            for todo in todos:

                if todo.due_date < today_date:
                    todo.section = "Overdue"
                    db.session.commit()

                elif todo.due_date == today_date:
                    todo.section = "Today"
                    db.session.commit()
                
                else:
                    todo.section = "Upcoming"
                    db.session.commit()

            todo_list = list(map(lambda todo: todo.to_json(), todos))
            return jsonify({"todos":todo_list}),200
        return jsonify({"message": "No todos have been created"})
    except Exception as e:
        print("error")
        return jsonify({"message": str(e)}),400


@app.route('/api/create_todo', methods=['POST'])
@jwt_required()
def create_todo():
    name = request.json.get('name')
    due_date = request.json.get('due_date')
    today = date.today()
    today_date = today.strftime('%Y-%m-%d')
    section = ""

    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])

        if not user:
            return jsonify({"message": "User not found"}), 404

        if due_date == today_date:
            section = "Today"

        new_todo = Todos(name=name, user_id=user.id, due_date=due_date, section=section)
        db.session.add(new_todo)
        db.session.commit() 

        return jsonify({"message": "todo created succesfully!"}),201

    except Exception as e:
        return jsonify({"message": str(e)}),400

@app.route('/api/update_priority', methods=['PATCH'])
@jwt_required()
def update_priority():
    todo_id = request.json.get('id')
    priority = request.json.get('priority')

    try:
        todo = Todos.query.get(todo_id)
        todo.priority = priority
        db.session.commit()
        return jsonify({"message": "Priority updated succesfully!"})

    except Exception as e:
        return jsonify({"message": str(e)}) 

@app.route('/api/update_todo', methods=['PATCH'])
@jwt_required()
def update_todo():
    todo_id = request.json.get("id")
    todo_name = request.json.get("name") 
    todo_duedate = request.json.get("due_date") 
    todo_priority = request.json.get("priority") 
 
    try:
        current_todo = Todos.query.get(todo_id)
        current_todo.name = todo_name
        current_todo.due_date = todo_duedate
        if todo_priority:
            current_todo.priority = todo_priority
        db.session.commit()
        return jsonify({"message": "Todo updated succesfully!"})

    except Exception as e:
        return jsonify({"message":str(e)})

@app.route('/api/complete_todo', methods=['PATCH'])
@jwt_required()
def complete_todo():
    todo_id = request.json.get('id')
    completed = request.json.get('completed')
    try:
        todo = Todos.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
        return jsonify({"message": "Todo updated succesfully!"})
    except Exception as e:
        return jsonify({"message": str(e)})

@app.route('/api/delete_todo', methods=['POST'])
@jwt_required()
def delete_todo():
    todo_id = request.json.get('id')
    try:
        todo = Todos.query.get(todo_id)
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted succesfully!"})
    except Exception as e:
        return jsonify({"message": str(e)})
  
@app.route('/api/create_section', methods=['POST'])
@jwt_required()
def create_section():
    name = request.json.get("naame")
    try:
        new_section = User(section=name)
        db.session.add(new_section)
        db.session.commit()
    except ValueError as error:
        return jsonify({"message": "Could not create section"})

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    if len(username) > 15:
        return jsonify({"message": "Username is too long"}),400
    if '@' not in email:
        return jsonify({"message": "Invalid email"}),400
    if not email or not username or not password:
        return jsonify({"message": "Missing credentials"}),400
    
    hashed = generate_password_hash(password)
    
    try:
        new_user = User(username=username, password=hashed, email=email)
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        db.session.remove()
        return jsonify({"message": "Failed to register"}),500
    
    return jsonify({"message": "User registered succesfully"}),201

@app.route('/api/login', methods=['POST'])
def login():

    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"message": "Missing credentials"}),400
    
    #Checks if there is a user registered with the email
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        #If password matches, creates a tokenn including user's info and sends it to the frontend
        access_token = create_access_token(identity={"id":user.id, "username":user.username, "sections":user.sections})
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}),401



#Route to get the user's info
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():

    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])
        if user:
            return jsonify({
                "user": {
                    "id":user.id,
                    "email":user.email,
                    "username":user.username,
                    "sections":user.sections
                }
            }),200
        else:
            return jsonify({"message": "User not found"}), 404
        
    except Exception as error:
        return jsonify({"message": "Internal server error"}), 500



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)