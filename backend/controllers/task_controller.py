from flask import Blueprint, request, jsonify
from services.task_service import Task_Service

task_controller = Blueprint('task_controller', __name__)
task_service = Task_Service()

@task_controller.route("/api/add-task", methods=["POST"])
def add_task():
    data = request.get_json()
    email = data.get("email")
    project = data.get("project")
    task = data.get("task")

    if not all([email, project, task]):
        return jsonify({"error": "Missing required fields"}), 400

    task_service.insert_task(email, project, task)
    return jsonify({"message": "Task added successfully"})
