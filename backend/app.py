from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from config import app, db ,jwt

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
        db.commit()
    except Exception as error:
        db.session.rollback()
        return jsonify({"message": "Failed to register"}),500
    
    return jsonify({"message": "User registered succesfully"}),201

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get(email)
    password = request.json.get(password)

    if not email or not password:
        return jsonify({"message": "Missing credentials"}),400
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        acces_token = create_access_token(identity=user.id)
        return jsonify({"access_token": acces_token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}),401

@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify({
            "user": {
            "id":user.id,
            "email":user.email,
            "username":user.username
        }}),200
    else:
        return jsonify({"message": "User not found"}), 404


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debuf=True)