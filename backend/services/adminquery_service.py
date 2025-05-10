from db import get_db_connection

def get_all_task_logs():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT Email, ProjectName, TaskDescription, CreatedAt FROM TaskLog")
    rows = cursor.fetchall()

    # Convert to list of dicts
    columns = [column[0] for column in cursor.description]
    task_logs = [dict(zip(columns, row)) for row in rows]

    conn.close()
    return task_logs
