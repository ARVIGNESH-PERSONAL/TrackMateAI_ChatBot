from db import get_db_connection

class Task_Service:
    @staticmethod
    def insert_task(email, projectDetails):
        conn = get_db_connection()
        cursor = conn.cursor()

        for project in projectDetails:
            project_name = project.get('projectName')
            task_description = project.get('projectDescription')
            project_status = project.get('projectStatus')

            cursor.execute(
                "INSERT INTO TaskLog (Email, ProjectName, TaskDescription, ProjectStatus) VALUES (?, ?, ?, ?)",
                (email, project_name, task_description, project_status)
            )

        conn.commit()
        conn.close()
