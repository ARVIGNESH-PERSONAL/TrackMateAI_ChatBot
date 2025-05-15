import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to, subject, body):
    sender_email = "arvigneshpersonal1@gmail.com"
    sender_password = "ilvzdllx oatqocls"  

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to, message.as_string())
        server.quit()
    except Exception as e:
        print("Email failed:", e)
        raise
