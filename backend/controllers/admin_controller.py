from flask import Blueprint, request, jsonify
from services.adminquery_service import get_all_task_logs
from utils.gemini_integration import ask_gemini

admin_controller = Blueprint('admin_controller', __name__)

@admin_controller.route("/api/admin/query", methods=["POST"])
def admin_query():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    # Get task logs from DB
    task_logs = get_all_task_logs()

    if not task_logs:
        return jsonify({"error": "No task logs found"}), 404

    # Format logs for Gemini
    formatted_logs = "\n".join(
        f"{log['Email']} | {log['ProjectName']} | {log['TaskDescription']} | {log['CreatedAt']}"
        for log in task_logs
    )

    # Construct Gemini prompt
    prompt = f"""
You are an AI assistant analyzing team task logs.

Here is the task log data:
{formatted_logs}

Answer the following admin query based on the above data:
"{question}"

since I am getting direct asnwers from you and displaying to the user do dont use from the above data like sentences

"""

    # Get AI response
    try:
        ai_response = ask_gemini(prompt)
        print('ai_response'  , ai_response)
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
