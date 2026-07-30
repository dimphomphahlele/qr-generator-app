from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import qrcode
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['POST'])
def generate_qr():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to bytes
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return jsonify({'image': img_str})

if __name__ == '__main__':
    app.run(debug=True, port=8000)