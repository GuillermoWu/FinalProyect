from flask import Flask, request, jsonify, session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Todos
from werkzeug.security import generate_password_hash, check_password_hash


from config import app, db ,jwt



@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5173')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Headers')
    return response

@app.route('/get_todos', methods=['GET'])
@jwt_required()
def get_todos():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        todos = Todos.query.filter_by(user_id=user.id).first()
        todo_list = list(map(lambda todo: todo.to_json(), todos))
        return jsonify({"todos":todo_list}),200
    except Exception as e:
        return jsonify({"message": str(e)}),400

@app.route('/create_todo', methods=['POST', 'GET'])
@jwt_required()
def create_todo():
    name = request.json.get('name')
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id["id"])
        new_todo = Todos(name=name, user_id=user.id)
        db.session.add(new_todo)
        db.session.commit()
        return jsonify({"message": "todo created succesfully!"}),201
    except Exception as e:
        return jsonify({"message": e}),400

@app.route('/update_todo', methods=['PATCH', 'GET', 'POST'])
@jwt_required()
def update_todo():
    return jsonify({"message":"."})


@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

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

@app.route('/login', methods=['POST'])
def login():

    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"message": "Missing credentials"}),400
    
    #Checks if there is a user registered with the email
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        #If password matches, creates a tokenn including user's info and sends it to the frontend
        access_token = create_access_token(identity={"id":user.id, "username":user.username})
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}),401



#Route to get the user's info
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        current_user_id = get_jwt_identity()
        print(f"user id:{current_user_id["id"]}")
        user = User.query.get(current_user_id["id"])
        if user:
            return jsonify({
                "user": {
                    "id":user.id,
                    "email":user.email,
                    "username":user.username
                }
            }),200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as error:
        print(f"error:{error}")
        return jsonify({"message": "Internal server error"}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)