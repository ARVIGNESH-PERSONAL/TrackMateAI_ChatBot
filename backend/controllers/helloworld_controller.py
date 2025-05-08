from flask import Blueprint, jsonify
from services.helloworld_service import HelloworldService

helloworld_service = HelloworldService()

helloworld_controller = Blueprint('helloworld_controller', __name__)

# Get Hello World (GET request)
@helloworld_controller.route('/api/helloworld', methods=['GET'])
def print_helloworld():
    message = helloworld_service.print_helloworld()
    return jsonify({'message': message})
