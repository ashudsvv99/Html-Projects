"""
Blog Generator

This module handles the generation of blog posts from YouTube transcripts
using the DeepSeek API for text processing and formatting.
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class BlogGenerator:
    """Class to handle blog generation using DeepSeek API."""
    
    def __init__(self):
        """Initialize the BlogGenerator with API credentials."""
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.api_url = "https://api.deepseek.com/v1/chat/completions"  # Update with actual DeepSeek API endpoint
        
        if not self.api_key:
            print("Warning: DEEPSEEK_API_KEY not found in environment variables.")
    
    def generate_blog(self, transcript, options):
        """
        Generate a blog post from a YouTube transcript using DeepSeek API.
        
        Args:
            transcript (str): The YouTube video transcript.
            options (dict): Options for blog generation including:
                - 'length': Blog length ('short', 'medium', 'long')
                - 'style': Writing style ('conversational', 'professional', 'technical')
                - 'keywords': List of keywords to include
                - 'title': Optional custom title
        
        Returns:
            dict: A dictionary containing:
                - 'success' (bool): Whether the generation was successful
                - 'blog_content' (dict): The generated blog content if successful
                - 'error' (str): Error message if not successful
        """
        try:
            # Validate input
            if not transcript or len(transcript.strip()) < 50:
                return {
                    'success': False,
                    'error': 'Transcript is too short or empty.'
                }
            
            # Set default options if not provided
            length = options.get('length', 'medium')
            style = options.get('style', 'professional')
            keywords = options.get('keywords', [])
            custom_title = options.get('title', '')
            
            # Map length to word count
            word_count_map = {
                'short': 500,
                'medium': 800,
                'long': 1200
            }
            target_word_count = word_count_map.get(length, 800)
            
            # Create prompt for DeepSeek API
            prompt = self._create_prompt(transcript, target_word_count, style, keywords, custom_title)
            
            # Call DeepSeek API
            response = self._call_deepseek_api(prompt)
            
            # Process the response
            if response and 'choices' in response:
                blog_content = self._process_api_response(response)
                return {
                    'success': True,
                    'blog_content': blog_content
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to generate blog content from API response.'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'An error occurred during blog generation: {str(e)}'
            }
    
    def _create_prompt(self, transcript, word_count, style, keywords, custom_title):
        """
        Create a prompt for the DeepSeek API based on the transcript and options.
        
        Args:
            transcript (str): The YouTube video transcript.
            word_count (int): Target word count for the blog.
            style (str): Writing style.
            keywords (list): Keywords to include.
            custom_title (str): Optional custom title.
            
        Returns:
            str: The formatted prompt for the API.
        """
        keywords_str = ", ".join(keywords) if keywords else "relevant keywords"
        
        prompt = f"""
        You are an expert content writer. Transform the following YouTube video transcript into a well-structured, 
        SEO-optimized blog post of approximately {word_count} words.
        
        Write in a {style} style and include the following keywords where appropriate: {keywords_str}.
        
        Structure the blog post with:
        1. An engaging title {f'(using the suggestion: {custom_title})' if custom_title else ''}
        2. A compelling introduction that hooks the reader
        3. Main content with appropriate H2 and H3 headings
        4. Bullet points or numbered lists where appropriate
        5. A conclusion with a call-to-action
        6. A FAQ section with 3-5 relevant questions and answers
        
        Also include:
        - Meta description (150-160 characters)
        - SEO title (50-60 characters)
        - 5 relevant tags
        
        Format the output as JSON with the following structure:
        {{
            "title": "Blog Title",
            "meta_description": "SEO-optimized meta description",
            "seo_title": "SEO Title",
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
            "content": "Full blog content with HTML formatting",
            "sections": [
                {{"type": "introduction", "content": "Intro text"}},
                {{"type": "heading", "level": 2, "content": "First H2 Heading"}},
                {{"type": "paragraph", "content": "Paragraph text"}},
                ...
            ],
            "faq": [
                {{"question": "First question?", "answer": "Answer to first question"}},
                ...
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
        
        data = {
            "model": "deepseek-chat",  # Update with the appropriate model name
            "messages": [
                {"role": "system", "content": "You are an expert content writer specializing in converting video transcripts into engaging blog posts."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 4000
        }
        
        response = requests.post(self.api_url, headers=headers, data=json.dumps(data))
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed with status code {response.status_code}: {response.text}")
    
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
                return blog_data
            else:
                # If no JSON found, return the raw content
                return {
                    "title": "Generated Blog Post",
                    "content": content,
                    "sections": [{"type": "paragraph", "content": content}]
                }
                
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw content
            return {
                "title": "Generated Blog Post",
                "content": content,
                "sections": [{"type": "paragraph", "content": content}]
            }

