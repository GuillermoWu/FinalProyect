from datetime import datetime
from config import db

#Creates flask database model of User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

class TodoSections(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return{
            'id':self.id,
            'name':self.name,
            'user_id':self.user_id
        }
    

#Creates flask database model of Todos
class Todos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    section = db.Column(db.String(20), nullable=False)
    section_id = db.Column(db.Integer, nullable=False)
    priority = db.Column(db.Integer(), default=0)
    due_date = db.Column(db.Text(), nullable=True)

    def to_json(self):
        if self.due_date:
            due_date_formatted = datetime.strptime(self.due_date, '%Y-%m-%d').date().isoformat()
        return{
            'id':self.id,
            'user_id':self.user_id,
            'name':self.name,
            'completed':self.completed,
            'section': self.section,
            'priority': self.priority,
            'due_date': due_date_formatted
        }