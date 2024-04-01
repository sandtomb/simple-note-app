
import datetime

from peewee import (
    SqliteDatabase,
    Model,
    TextField,
    DateTimeField,
)

DB_PATH = './database.db'
db = SqliteDatabase(DB_PATH)


class BaseModel(Model):
    class Meta:
        database = db


class Note(BaseModel):
    text = TextField()
    time_created = DateTimeField()


SETUP_DB=True
if SETUP_DB:
    db.connect()
    db.create_tables([Note])


from flask import (
    Flask,
    request,
    jsonify,
    abort,
    make_response,
    render_template,
)
from flask_cors import CORS
from playhouse.shortcuts import model_to_dict

OK = 200
INTERNAL_SERVER_ERROR = 500


app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)


@app.route('/notes', methods=['GET'])
def all_notes():
    try:
        query = Note.select()
        notes = [model_to_dict(note) for note in query]
        response = make_response(jsonify(notes=notes), OK)
        return response
    except Exception as e:
        abort(INTERNAL_SERVER_ERROR)


@app.route('/addNote', methods=['POST'])
def add_note():
    try:
        new_note_text = request.args.get('noteText', None)
        if new_note_text:
            new_note = Note.create(text=new_note_text, time_created=datetime.datetime.now())
            response = make_response(
                jsonify(new_note=model_to_dict(new_note), success=True),
                OK
            )
            return response
        else:
            raise Exception('note was blank')
    except Exception:
        abort(INTERNAL_SERVER_ERROR)


@app.route('/clearNotes', methods=['PUT'])
def clear_notes():
    try:
        Note.delete().execute()
        response = make_response(jsonify(success=True), OK)
        return response
    except Exception:
        abort(INTERNAL_SERVER_ERROR)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
