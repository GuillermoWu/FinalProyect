from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Todos, TodoSections, Classes
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date
from config import app, db 




@app.route("/api/get_todos", methods=["GET"])
@jwt_required()
def get_todos():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])
        if not user:
            return jsonify({"nessage": "User not found"}), 404
        
        todos = Todos.query.filter_by(user_id=user.id).all()

        if not todos:
            return jsonify({"message": "No todos have been created"})
        
        todo_list = list(map(lambda todo: todo.to_json(), todos))
        return jsonify({"todos":todo_list}),200
        
    except Exception as e:
        print(str(e))
        return jsonify({"message": str(e)}),400


@app.route("/api/create_todo", methods=["POST"])
@jwt_required()
def create_todo():
    name = request.json.get("name")
    priority = request.json.get("priority")
    due_date = request.json.get("due_date")
    section = request.json.get("section")
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])
        section = TodoSections.query.filter_by(name=section, user_id=user.id).first()
        
        if not user:
            return jsonify({"message": "User not found"}), 404

        new_todo = Todos(name=name, user_id=user.id, priority=priority if priority else 2,due_date=due_date, section=section.name if section else "", section_id=section.id if section else "")
        db.session.add(new_todo)
        db.session.commit() 

        return jsonify({"message": "todo created succesfully!"}),201

    except Exception as e:
        return jsonify({"message": str(e)}),400

@app.route("/api/update_priority", methods=["PATCH"])
@jwt_required()
def update_priority():
    todo_id = request.json.get("id")
    priority = request.json.get("priority")

    try:
        todo = Todos.query.get(todo_id)
        todo.priority = priority
        db.session.commit()
        return jsonify({"message": "Priority updated succesfully!"})

    except Exception as e:
        return jsonify({"message": str(e)}) 

@app.route("/api/update_todo", methods=["PATCH"])
@jwt_required()
def update_todo():
    todo_id = request.json.get("id")
    todo_name = request.json.get("name") 
    todo_duedate = request.json.get("due_date") 
    todo_section = request.json.get("section")
    
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])

        current_todo = Todos.query.get(todo_id)
        current_todo.name = todo_name

        current_todo.due_date = todo_duedate

        if todo_section == "":
            current_todo.section = ""
            current_todo.section_id = None
        else:
            section = TodoSections.query.filter_by(name=todo_section, user_id=user.id).first()
            current_todo.section = section.name
            current_todo.section_id = section.id
    
        db.session.commit()
        return jsonify({"message": "Todo updated succesfully!"})

    except Exception as e:
        return jsonify({"message":str(e)})

@app.route("/api/complete_todo", methods=["PATCH"])
@jwt_required()
def complete_todo():
    todo_id = request.json.get("id")
    completed = request.json.get("completed")
    try:
        todo = Todos.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
        return jsonify({"message": "Todo updated succesfully!"})
    except Exception as e:
        return jsonify({"message": str(e)})

@app.route("/api/delete_todo", methods=["POST"])
@jwt_required()
def delete_todo():
    todo_id = request.json.get("id")
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        todo = Todos.query.filter_by(id=todo_id, user_id=user.id).first()
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted succesfully!"})
    except Exception as e:
        return jsonify({"message": str(e)})
  
@app.route("/api/get_classes", methods=["GET"])
@jwt_required()
def get_classes():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return jsonify({"message": "Session expired"}), 404
        
        classes = Classes.query.filter_by(user_id=user.id).all()

        if not classes:
            return jsonify({"message": "No classes have been created"})
        
        classes_list = list(map(lambda class_item: class_item.to_json(), classes))
        return jsonify({"classes": classes_list}),200
    
    except Exception as error:
        return jsonify({"message": str(error)}),400
    
@app.route("/api/create_class", methods=["POST"])
@jwt_required()
def create_class():
    name = request.json.get("name")
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user ["id"])
        if not user:
            return jsonify({"message": "Session expired"})
        
        new_class = Classes(name=name, user_id=user.id)
        db.session.add(new_class)
        db.session.commit()
        return jsonify({"message": "Class created succesfully"}),201
    except Exception as error:
        return jsonify({"message": str(error)})

@app.route("/api/get_sections", methods=["GET"])
@jwt_required()
def get_sections():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user ["id"])
        if not user:
            return jsonify({"message": "Session expired"})
        
        sections = TodoSections.query.filter_by(user_id=user.id).all()
        sections_list = list(map(lambda section: section.to_json(), sections))
        return jsonify({"sections": sections_list})
        
    except Exception as e:
        return jsonify({"message": str(e)})

@app.route("/api/create_section", methods=["POST"])
@jwt_required()
def create_section():
    name = request.json.get("name")
 
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return jsonify({"message": "Session expired"}), 404
        
        new_section = TodoSections(name=name, user_id=user.id)
        db.session.add(new_section)
        db.session.commit()
        return({"message": "Section created sucessfully"}),201
    except Exception as error:
        return jsonify({"message": "Could not create section"})

@app.route("/api/delete_section", methods=["POST"])
@jwt_required()
def delete_section():
    section_id = request.json.get("section_id")
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return jsonify({"message": "Session Expired"}), 404

        section = TodoSections.query.filter_by(id=section_id, user_id=user.id).first()
        db.session.delete(section)
        db.session.commit()
        return jsonify({"message": "Section deleted succesfully!"})
    except Exception as e:
        return jsonify({"message": "Failed to delete section"})

@app.route("/api/register", methods=["POST"])
def register():
    username = request.json.get("username")
    password = request.json.get("password")
    email = request.json.get("email")

    if len(username) > 15:
        return jsonify({"message": "Username is too long"}),400
    if "@" not in email:
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

@app.route("/api/login", methods=["POST"])
def login():

    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({"message": "Missing credentials"}),400
    
    #Checks if there is a user registered with the email
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        #If password matches, creates a tokenn including user"s info and sends it to the frontend
        access_token = create_access_token(identity={"id":user.id, "username":user.username})
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}),401



#Route to get the user"s info
@app.route("/api/protected", methods=["GET"])
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