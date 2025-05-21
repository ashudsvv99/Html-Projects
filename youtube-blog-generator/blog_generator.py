"""
Blog Generator

This module handles the generation of blog posts from YouTube transcripts
using the DeepSeek API for text processing and formatting.
"""

import os
import requests
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BlogGenerator:
    """Class to handle blog generation using DeepSeek API."""
    
    def __init__(self):
        """Initialize the BlogGenerator with API credentials."""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        # Updated with the correct DeepSeek API endpoint
        self.api_url = os.getenv('DEEPSEEK_API_URL', 'https://api.deepseek.ai/v1/chat/completions')
        
        if not self.api_key:
            logger.warning("DEEPSEEK_API_KEY not found in environment variables.")
    
    def generate_blog(self, transcript, options):
        """
        Generate a blog post from a YouTube video transcript using DeepSeek API.
        
        Args:
            transcript (str): The YouTube video transcript.
            options (dict): Options for blog generation including:
                - 'length': Blog length ('short', 'medium', 'long')
                - 'style': Writing style ('conversational', 'professional', 'technical')
                - 'keywords': List of keywords to include
                - 'title': Optional custom title
                - 'video_details': Optional video details from YouTube API
        
        Returns:
            dict: A dictionary containing:
                - 'success' (bool): Whether the generation was successful
                - 'blog_content' (dict): The generated blog content if successful
                - 'error' (str): Error message if not successful
        """
        try:
            # Validate input
            if not transcript:
                return {
                    'success': False,
                    'error': 'Transcript is empty.'
                }
            
            if len(transcript.strip()) < 50:
                return {
                    'success': False,
                    'error': 'Transcript is too short. It should be at least 50 characters.'
                }
            
            # Set default options if not provided
            length = options.get('length', 'medium')
            style = options.get('style', 'professional')
            keywords = options.get('keywords', [])
            custom_title = options.get('title', '')
            video_details = options.get('video_details', None)
            
            # Map length to word count
            word_count_map = {
                'short': 500,
                'medium': 800,
                'long': 1200
            }
            target_word_count = word_count_map.get(length, 800)
            
            # Handle large transcripts by truncating if necessary
            max_transcript_length = 10000  # Adjust based on API limitations
            if len(transcript) > max_transcript_length:
                logger.warning(f"Transcript exceeds {max_transcript_length} characters. Truncating.")
                transcript = transcript[:max_transcript_length] + "... (truncated)"
            
            # Create prompt for DeepSeek API
            prompt = self._create_prompt(transcript, target_word_count, style, keywords, custom_title, video_details)
            
            # Call DeepSeek API
            response = self._call_deepseek_api(prompt)
            
            # Process the response
            if response and 'choices' in response:
                blog_content = self._process_api_response(response)
                
                # Add video details to blog content if available
                if video_details and isinstance(blog_content, dict):
                    blog_content['video_details'] = {
                        'title': video_details.get('title', ''),
                        'channel': video_details.get('channel_title', ''),
                        'published_at': video_details.get('published_at', ''),
                        'thumbnail_url': video_details.get('thumbnail_url', '')
                    }
                
                return {
                    'success': True,
                    'blog_content': blog_content
                }
            else:
                logger.error(f"Unexpected API response format: {response}")
                return {
                    'success': False,
                    'error': 'Failed to generate blog content from API response.'
                }
                
        except requests.exceptions.Timeout:
            logger.error("API request timed out")
            return {
                'success': False,
                'error': 'The request to the DeepSeek API timed out. Please try again later.'
            }
        except requests.exceptions.ConnectionError:
            logger.error("Connection error when calling API")
            return {
                'success': False,
                'error': 'Could not connect to the DeepSeek API. Please check your internet connection and try again.'
            }
        except Exception as e:
            logger.error(f"Error during blog generation: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': f'An error occurred during blog generation: {str(e)}'
            }
    
    def _create_prompt(self, transcript, word_count, style, keywords, custom_title, video_details=None):
        """
        Create a prompt for the DeepSeek API based on the transcript and options.
        
        Args:
            transcript (str): The YouTube video transcript.
            word_count (int): Target word count for the blog.
            style (str): Writing style.
            keywords (list): Keywords to include.
            custom_title (str): Optional custom title.
            video_details (dict): Optional video details from YouTube API.
            
        Returns:
            str: The formatted prompt for the API.
        """
        keywords_str = ", ".join(keywords) if keywords else "relevant keywords"
        
        # Add video details to the prompt if available
        video_context = ""
        if video_details:
            video_context = f"""
            This blog is based on a YouTube video titled: "{video_details.get('title', '')}"
            Channel: {video_details.get('channel_title', '')}
            Published: {video_details.get('published_at', '').split('T')[0] if video_details.get('published_at') else ''}
            
            Video tags: {', '.join(video_details.get('tags', [])[:10]) if video_details.get('tags') else 'None'}
            Category: {video_details.get('category_id', '')}
            
            Use this information to create a more contextually relevant blog post.
            """
        
        prompt = f"""
        You are an expert content writer specializing in creating engaging, SEO-optimized blog posts from video transcripts.
        
        Transform the following YouTube video transcript into a well-structured, reader-friendly blog post of approximately {word_count} words.
        
        {video_context}
        
        WRITING STYLE AND TONE:
        - Write in a {style} style that sounds natural and human-written
        - Avoid overly formal academic language or robotic phrasing
        - Use conversational transitions between paragraphs
        - Vary sentence structure and length for better readability
        - Include occasional rhetorical questions to engage readers
        - Use active voice predominantly
        
        SEO OPTIMIZATION:
        - Include the following keywords naturally throughout the text: {keywords_str}
        - Create an SEO-friendly title {f'(using the suggestion: {custom_title})' if custom_title else ''}
        - Include semantic variations of keywords
        - Optimize heading structure with relevant keywords
        - Create a meta description that includes primary keywords
        
        CONTENT STRUCTURE:
        1. An attention-grabbing title that includes primary keywords
        2. A compelling introduction that hooks the reader (150-200 words)
        3. Main content with proper H2 and H3 headings (organized by topics from the transcript)
        4. Use bullet points or numbered lists where appropriate
        5. Include 2-3 relevant examples or case studies from the transcript
        6. A conclusion with a clear call-to-action
        7. A FAQ section with 3-5 relevant questions and answers
        
        ADDITIONAL ELEMENTS:
        - Meta description (150-160 characters)
        - SEO title (50-60 characters)
        - 5 relevant tags
        - Suggested image descriptions for 2-3 places in the article
        
        Format the output as JSON with the following structure:
        {{
            "title": "SEO-Optimized Blog Title",
            "meta_description": "Compelling meta description with keywords",
            "seo_title": "Shorter SEO Title with Primary Keyword",
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
            "content": "Full blog content with HTML formatting",
            "sections": [
                {{"type": "introduction", "content": "Intro text"}},
                {{"type": "heading", "level": 2, "content": "First H2 Heading"}},
                {{"type": "paragraph", "content": "Paragraph text"}},
                {{"type": "list", "style": "bullet", "items": ["Item 1", "Item 2", "Item 3"]}},
                {{"type": "image_suggestion", "description": "Suggested image description", "placement": "after paragraph X"}}
            ],
            "faq": [
                {{"question": "First question?", "answer": "Answer to first question"}},
                {{"question": "Second question?", "answer": "Answer to second question"}}
            ]
        }}
        
        Here's the transcript:
        {transcript}
        """
        
        return prompt
    
    def _call_deepseek_api(self, prompt):
        """
        Call the DeepSeek API with the given prompt.
        
        Args:
            prompt (str): The prompt for the API.
            
        Returns:
            dict: The API response.
        """
        if not self.api_key:
            raise ValueError("DeepSeek API key is not set. Please set the DEEPSEEK_API_KEY environment variable.")
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # Updated with the correct model name and parameters
        data = {
            "model": os.getenv('DEEPSEEK_MODEL', 'deepseek-chat'),
            "messages": [
                {"role": "system", "content": "You are an expert content writer specializing in converting video transcripts into engaging, SEO-optimized blog posts that sound natural and human-written."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 4000,
            "top_p": 1,
            "frequency_penalty": 0.2,
            "presence_penalty": 0.1
        }
        
        try:
            # Added timeout parameter
            response = requests.post(
                self.api_url, 
                headers=headers, 
                data=json.dumps(data),
                timeout=60  # 60 second timeout
            )
            
            response.raise_for_status()  # Raise exception for 4XX/5XX responses
            
            return response.json()
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            error_message = f"API request failed with status code {status_code}"
            
            try:
                error_data = e.response.json()
                if 'error' in error_data:
                    error_message += f": {error_data['error']}"
            except:
                error_message += f": {e.response.text}"
            
            logger.error(error_message)
            raise Exception(error_message)
        except requests.exceptions.Timeout:
            logger.error("API request timed out")
            raise requests.exceptions.Timeout("Request to DeepSeek API timed out")
        except requests.exceptions.ConnectionError:
            logger.error("Connection error")
            raise
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {str(e)}", exc_info=True)
            raise
    
    def _process_api_response(self, response):
        """
        Process the API response to extract the blog content.
        
        Args:
            response (dict): The API response.
            
        Returns:
            dict: The processed blog content.
        """
        # Extract the content from the API response
        content = response['choices'][0]['message']['content']
        
        # Try to parse the JSON content
        try:
            # Find JSON in the response (in case there's additional text)
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_content = content[json_start:json_end]
                blog_data = json.loads(json_content)
                
                # Validate the blog data structure
                required_fields = ['title', 'content']
                for field in required_fields:
                    if field not in blog_data:
                        logger.warning(f"Required field '{field}' missing from API response")
                        blog_data[field] = f"Generated {field.capitalize()}"
                
                return blog_data
            else:
                # If no JSON found, return the raw content
                logger.warning("No JSON structure found in API response")
                return {
                    "title": "Generated Blog Post",
                    "content": content,
                    "sections": [{
                        "type": "paragraph", 
                        "content": content
                    }]
                }
                
        except json.JSONDecodeError as e:
            # If JSON parsing fails, return the raw content
            logger.error(f"Failed to parse JSON from API response: {str(e)}")
            return {
                "title": "Generated Blog Post",
                "content": content,
                "sections": [{
                    "type": "paragraph", 
                    "content": content
                }]
            }
