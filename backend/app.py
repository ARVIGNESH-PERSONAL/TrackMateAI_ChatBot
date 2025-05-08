from flask import Flask
from controllers.helloworld_controller import helloworld_controller

app = Flask(__name__)

# Register the blueprint
app.register_blueprint(helloworld_controller)

if __name__ == '__main__':
    app.run(debug=True)