from flask import Flask, send_file, request, Response
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.generative_models import GenerativeModel
import vertexai
from PIL import Image
import io
import os
from google.auth.exceptions import DefaultCredentialsError

app = Flask(__name__)

# Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/workspaces/friday/imagegen3/service-account-key.json"

try:
    # Initialize Vertex AI
    vertexai.init(project="friday-458605", location="us-central1")
    image_generation_model = ImageGenerationModel.from_pretrained("imagegen-4-001")  # Updated to Imagen 4
except DefaultCredentialsError as e:
    print(f"Credential error: {e}")
    raise
except Exception as e:
    print(f"Error initializing Vertex AI for Imagen 4: {e}")
    raise

# Helper function for text generation
def handle_text_generation(model_name):
    try:
        data = request.get_json()
        prompt = data.get('prompt', f'Tell me something interesting using {model_name}.')

        # Initialize the specific GenerativeModel
        model = GenerativeModel(model_name)

        # Generate text
        response = model.generate_content(prompt)

        # Extract and return the text
        return Response(response.text, mimetype='text/plain')

    except Exception as e:
        return Response(f"Error generating text with {model_name}: {str(e)}", status=500)

# Helper function for music generation with Lyria 2
def handle_music_generation():
    try:
        data = request.get_json()
        prompt = data.get('prompt', 'A 30-second upbeat electronic music track.')
        duration_seconds = data.get('duration', 30)  # Default to 30 seconds

        # Initialize Lyria 2 model (assumed model ID)
        model = GenerativeModel("lyria-2-001")  # Adjust model ID if different

        # Generate audio (assuming the model returns audio bytes)
        response = model.generate_content(
            prompt,
            generation_config={"duration_seconds": duration_seconds}
        )

        # Extract audio data (adjust based on actual response structure)
        audio_data = response.audio_bytes  # Hypothetical attribute; verify with API docs

        # Save to BytesIO for response
        audio_io = io.BytesIO(audio_data)

        # Return the audio file
        return send_file(audio_io, mimetype='audio/wav', as_attachment=True, download_name='generated_music.wav')

    except Exception as e:
        return Response(f"Error generating music with Lyria 2: {str(e)}", status=500)

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        # Get prompt from request
        data = request.get_json()
        prompt = data.get('prompt', 'A powerful image of a female astronaut in a spacesuit, looking out at the Earth from space.')

        # Generate image using Vertex AI Imagen 4
        images = image_generation_model.generate_images(
            prompt=prompt,
            number_of_images=1,
            aspect_ratio="1:1",
            negative_prompt="",
            safety_filter_level="block_few",
            person_generation="allow_adult",
            add_watermark=True,
        )

        # Extract image data
        generated_image = images[0]
        image_data = generated_image._image_bytes  # Assuming _image_bytes contains the image data

        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(image_data))

        # Save to BytesIO for response
        img_io = io.BytesIO()
        pil_image.save(img_io, format='PNG')
        img_io.seek(0)

        # Return the image
        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        return Response(f"Error generating image with Imagen 4: {str(e)}", status=500)

@app.route('/generate-music', methods=['POST'])
def generate_music():
    return handle_music_generation()

# --- Routes for Gemini Text Models (unchanged) ---

@app.route('/generate-text-gemini-2-flash', methods=['POST'])
def generate_text_gemini_2_flash():
    return handle_text_generation('gemini-2.0-flash-001')

@app.route('/generate-text-gemini-2-flash-lite', methods=['POST'])
def generate_text_gemini_2_flash_lite():
    return handle_text_generation('gemini-2.0-flash-lite-001')

@app.route('/generate-text-gemini-2.5-flash', methods=['POST'])
def generate_text_gemini_2_5_flash():
    return handle_text_generation('gemini-2.5-flash-preview-04-17')

@app.route('/generate-text-gemini-2.5-pro', methods=['POST'])
def generate_text_gemini_2_5_pro():
    return handle_text_generation('gemini-2.5-pro-preview-03-25')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)