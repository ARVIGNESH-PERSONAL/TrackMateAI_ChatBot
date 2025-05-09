from flask import Blueprint, request, jsonify
from services.getAllProject_service import GetAllProjectService

getAllProject_service = GetAllProjectService()
getAllProject_controller = Blueprint('getAllProject_controller', __name__)

@getAllProject_controller.route("/api/getall-projects", methods=["POST"])
def get_projects():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    projects = getAllProject_service.getAll_projects_by_email(email)
    return jsonify({"projects": projects})
