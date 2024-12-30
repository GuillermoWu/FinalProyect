from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy


load_dotenv()


app = Flask(__name__)



app.config['JWT_SECRET_KEY'] = '6a432013ecb84893d2149f78f1ca047ed9e9734ed430a29ee3da0070e50a2562'
app.config['SECRET_KEY'] = 'dasdjahdwudasljfbskjlfflytfuat2953sakdjn+qwd'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finalproyect.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



db = SQLAlchemy(app)
jwt = JWTManager(app)


