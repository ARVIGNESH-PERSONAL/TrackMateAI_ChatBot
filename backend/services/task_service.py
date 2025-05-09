from db import get_db_connection

class Task_Service:
    def insert_task(self, email, project, task_description):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO TaskLog (Email, ProjectName, TaskDescription) VALUES (?, ?, ?)",
            (email, project, task_description)
        )
        conn.commit()
        conn.close()
