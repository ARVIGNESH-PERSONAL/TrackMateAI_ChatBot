from flask import Blueprint, request, jsonify
from services.adminquery_service import get_all_task_logs
from utils.gemini_integration import ask_gemini
from utils.email_helper import send_email 
from utils.docx_helper import generate_docx
import tempfile
import os

admin_controller = Blueprint('admin_controller', __name__)

@admin_controller.route("/api/admin/query", methods=["POST"])
def admin_query():
    data = request.get_json()
    email = data.get("email")
    question = data.get("question")
    send_email_flag = "send" in question.lower() and "email" in question.lower()

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

        dont show email name a name of the user take name out of email and show it to the user
        """

    # Get AI response
    try:
        ai_response = ask_gemini(prompt)
        print('ai_response'  , ai_response)

        if send_email_flag:
            username = email.split("@")[0]
            recipient_email = f"{username}@unitedtechno.com" 
            subject = "Requested Report from TrackMate AI"
            body = f"Query: {question}\n\nAnswer:\n{ai_response}"
            send_email(to=recipient_email, subject=subject, body=body)
            return jsonify({"response": f"I've sent the answer to your email: {recipient_email}"})
                           
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
