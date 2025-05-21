"""
YouTube Transcript to Blog Generator

A Flask web application that converts YouTube video transcripts into
well-structured blog posts using the DeepSeek API.
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import os
import json
import logging
import uuid
from datetime import timedelta
from dotenv import load_dotenv
from transcript_extractor import TranscriptExtractor
from blog_generator import BlogGenerator
import markdown
from flask_wtf.csrf import CSRFProtect

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)

# Initialize CSRF protection
csrf = CSRFProtect(app)

# Initialize components
transcript_extractor = TranscriptExtractor()
blog_generator = BlogGenerator()

@app.route('/')
def index():
    """Render the main page."""
    # Generate a unique session ID if not already present
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
        logger.info(f"New session created: {session['session_id']}")
    
    return render_template('index.html')

@app.route('/extract-transcript', methods=['POST'])
def extract_transcript():
    """
    Extract transcript from a YouTube video URL.
    
    Returns:
        JSON response with the extracted transcript or error message.
    """
    try:
        data = request.get_json()
        youtube_url = data.get('youtube_url', '').strip()
        language = data.get('language')
        
        logger.info(f"Extracting transcript for URL: {youtube_url[:50]}...")
        
        if not youtube_url:
            return jsonify({
                'success': False,
                'error': 'YouTube URL is required.'
            }), 400
        
        # Extract transcript
        result = transcript_extractor.get_transcript(youtube_url, language)
        
        if result['success']:
            # Store transcript and video details in session for later use
            session['transcript'] = result['transcript']
            session['video_id'] = result['video_id']
            
            # Store video details if available
            if 'video_details' in result:
                session['video_details'] = result['video_details']
                logger.info(f"Stored video details for: {result['video_details'].get('title', 'Unknown')}")
            
            session.modified = True
            
            # Return success response with preview
            preview_length = min(500, len(result['transcript']))
            preview = result['transcript'][:preview_length] + ('...' if len(result['transcript']) > preview_length else '')
            
            response_data = {
                'success': True,
                'transcript': preview,
                'video_id': result['video_id'],
                'language': result.get('language', 'unknown')
            }
            
            # Add video details to response if available
            if 'video_details' in result:
                response_data['video_title'] = result['video_details'].get('title', '')
                response_data['channel'] = result['video_details'].get('channel_title', '')
            
            return jsonify(response_data)
        else:
            # Return error response
            logger.warning(f"Transcript extraction failed: {result['error']}")
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
    except Exception as e:
        logger.error(f"Error in extract_transcript: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}'
        }), 500

@app.route('/generate-blog', methods=['POST'])
def generate_blog():
    """
    Generate a blog post from the extracted transcript.
    
    Returns:
        JSON response with the generated blog content or error message.
    """
    try:
        data = request.get_json()
        options = {
            'length': data.get('length', 'medium'),
            'style': data.get('style', 'professional'),
            'keywords': [k.strip() for k in data.get('keywords', '').split(',')] if data.get('keywords') else [],
            'title': data.get('title', '').strip()
        }
        
        logger.info(f"Generating blog with options: {options}")
        
        # Get transcript from session
        transcript = session.get('transcript')
        
        if not transcript:
            return jsonify({
                'success': False,
                'error': 'No transcript found. Please extract a transcript first.'
            }), 400
        
        # Add video details to options if available
        if 'video_details' in session:
            options['video_details'] = session['video_details']
            logger.info(f"Added video details to blog generation options")
        
        # Generate blog
        result = blog_generator.generate_blog(transcript, options)
        
        if result['success']:
            # Store blog content in session
            session['blog_content'] = result['blog_content']
            session.modified = True
            
            # Return success response
            return jsonify({
                'success': True,
                'redirect': url_for('result')
            })
        else:
            # Return error response
            logger.warning(f"Blog generation failed: {result['error']}")
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
    except Exception as e:
        logger.error(f"Error in generate_blog: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}'
        }), 500

@app.route('/result')
def result():
    """Render the result page with the generated blog content."""
    # Get blog content from session
    blog_content = session.get('blog_content')
    video_id = session.get('video_id')
    
    if not blog_content:
        logger.warning("Attempted to access result page without blog content")
        return redirect(url_for('index'))
    
    try:
        # Convert markdown content to HTML if needed
        if isinstance(blog_content, dict) and 'content' in blog_content:
            # Check if content is in markdown format
            if blog_content['content'] and not blog_content['content'].startswith('<'):
                blog_content['html_content'] = markdown.markdown(blog_content['content'], extensions=['extra'])
            else:
                blog_content['html_content'] = blog_content['content']
        
        return render_template('result.html', blog=blog_content, video_id=video_id)
    except Exception as e:
        logger.error(f"Error rendering result page: {str(e)}", exc_info=True)
        return render_template('error.html', error=f"An error occurred while rendering the blog: {str(e)}")

@app.route('/export', methods=['POST'])
def export_blog():
    """
    Export the generated blog content in various formats.
    
    Returns:
        The blog content in the requested format.
    """
    try:
        data = request.get_json()
        export_format = data.get('format', 'html')
        
        # Get blog content from session
        blog_content = session.get('blog_content')
        
        if not blog_content:
            return jsonify({
                'success': False,
                'error': 'No blog content found.'
            }), 400
        
        if export_format == 'json':
            return jsonify({
                'success': True,
                'content': json.dumps(blog_content, indent=2)
            })
        elif export_format == 'markdown':
            # Return markdown content
            if 'content' in blog_content:
                return jsonify({
                    'success': True,
                    'content': blog_content['content']
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'No markdown content available.'
                }), 400
        elif export_format == 'html':
            # Return HTML content
            if 'html_content' in blog_content:
                return jsonify({
                    'success': True,
                    'content': blog_content['html_content']
                })
            elif 'content' in blog_content:
                # Convert markdown to HTML if not already done
                html_content = markdown.markdown(blog_content['content'], extensions=['extra'])
                return jsonify({
                    'success': True,
                    'content': html_content
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'No content available to export as HTML.'
                }), 400
        else:
            return jsonify({
                'success': False,
                'error': f'Unsupported export format: {export_format}'
            }), 400
    except Exception as e:
        logger.error(f"Error in export_blog: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'An error occurred during export: {str(e)}'
        }), 500

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors."""
    return render_template('error.html', error="Page not found"), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors."""
    return render_template('error.html', error="Internal server error"), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true')
