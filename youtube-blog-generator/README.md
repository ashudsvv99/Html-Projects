# YouTube Transcript to Blog Generator

A powerful tool that converts YouTube video transcripts into well-structured, SEO-optimized blog posts using the DeepSeek API.

## Features

- **YouTube Transcript Extraction**: Extract transcripts from any YouTube video
- **AI-Powered Blog Generation**: Transform transcripts into structured blog posts using DeepSeek API
- **Customization Options**: Choose blog length, writing style, and include specific keywords
- **Export Capabilities**: Download or copy the generated blog in HTML or Markdown format
- **Responsive Web Interface**: User-friendly interface that works on all devices

## Project Structure

```
youtube-blog-generator/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   ├── index.html
│   └── result.html
├── app.py
├── transcript_extractor.py
├── blog_generator.py
├── requirements.txt
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-blog-generator.git
   cd youtube-blog-generator
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root directory with your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   SECRET_KEY=your_secret_key_for_flask
   ```

## Usage

1. Start the Flask application:
   ```
   python app.py
   ```

2. Open your web browser and navigate to `http://127.0.0.1:5000/`

3. Enter a YouTube video URL and click "Extract Transcript"

4. Configure the blog options (length, style, keywords, etc.)

5. Click "Generate Blog Post" to create your blog

6. View, copy, or download the generated blog post

## Components

### Transcript Extractor (`transcript_extractor.py`)

Handles the extraction of transcripts from YouTube videos using the `youtube_transcript_api` library. It can extract transcripts in different languages and process them into clean, readable text.

### Blog Generator (`blog_generator.py`)

Integrates with the DeepSeek API to transform the extracted transcript into a well-structured blog post. It supports various customization options like blog length, writing style, and keyword inclusion.

### Web Application (`app.py`)

A Flask web application that provides a user interface for the tool. It handles the extraction of transcripts, generation of blog posts, and export of the generated content.

## API Integration

This project uses the DeepSeek API for natural language processing and content generation. You'll need to obtain an API key from DeepSeek and add it to your `.env` file.

## Requirements

- Python 3.7+
- Flask
- youtube-transcript-api
- requests
- python-dotenv
- markdown

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [DeepSeek API](https://deepseek.com) for providing the AI capabilities
- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api) for transcript extraction
- [Flask](https://flask.palletsprojects.com/) for the web framework

