from flask import Flask
from flask_cors import CORS
from controllers.helloworld_controller import helloworld_controller
from controllers.loginvalidation_controller import loginvalidation_controller
from controllers.getAllProject_controller import getAllProject_controller
from controllers.task_controller import task_controller

app = Flask(__name__)
CORS(app)
# Register the blueprint
app.register_blueprint(helloworld_controller)
app.register_blueprint(loginvalidation_controller)
app.register_blueprint(getAllProject_controller)
app.register_blueprint(task_controller)

if __name__ == '__main__':
    app.run(debug=True)