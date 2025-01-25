from datetime import datetime
from config import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    profile_img = db.Column(db.String, nullable=False)

class Classes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return{
            'id':self.id,
            'name':self.name,
            'user_id':self.user_id
    }

class Terms(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False) 
    user_id = db.Column(db.Integer, nullable=False)
    class_id = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'class_id': self.class_id
    }

class Exams(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Text(), nullable=True)
    grade = db.Column(db.Integer, nullable = False)
    max_grade = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    class_id = db.Column(db.Integer, nullable=False)
    term_id = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'date': self.date,
            'grade': self.grade,
            'max_grade': self.max_grade,
            'user_id': self.user_id,
            'class_id': self.class_id,
            'term_id': self.term_id
    }

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


class Todos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    section = db.Column(db.String(20), nullable=True)
    section_id = db.Column(db.Integer, nullable=True)
    priority = db.Column(db.Integer(), default=0)
    due_date = db.Column(db.Text(), nullable=True)

    def to_json(self):
        
        return{
            'id':self.id,
            'user_id':self.user_id,
            'name':self.name,
            'completed':self.completed,
            'section': self.section,
            'priority': self.priority,
            'due_date': self.due_date
        }

class Sessions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    date = db.Column(db.Text(), nullable=True)
    duration = db.Column(db.Integer, nullable=False)

    def to_json(self):
        
        return{
            'id':self.id,
            'user_id':self.user_id,
            'name':self.name,
            'date': self.date,
            'duration': self.duration
        }
    
class Exercises(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    training_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Integer, nullable=False)

    def to_json(self):
        
        return{
            'id':self.id,
            'user_id':self.user_id,
            'training_id':self.training_id,
            'name':self.name,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight
        }