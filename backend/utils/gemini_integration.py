import google.generativeai as genai

def ask_gemini(prompt):
    api_key = "AIzaSyBUn0SAS0rVz9apJhMemcVuAZwhCy6ZkOw"
    
    # First, configure the API key
    genai.configure(api_key=api_key)
    
    # Now, list models (this will work because the API key is configured)
    models = genai.list_models()
    for model in models:
        print(model.name, model.supported_generation_methods)
    
    # Generate content with the model
    model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()
