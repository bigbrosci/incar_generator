#!/usr/bin/env python3
"""
Q-robot INCAR Generator Launcher
Simple script to start the web interface with helpful information
"""

import os
import sys
import webbrowser
from pathlib import Path
import subprocess
import time

def main():
    print("\n" + "="*60)
    print("🤖 Q-robot INCAR Generator - Web Interface")
    print("="*60)
    
    # Get the gui directory
    gui_dir = Path(__file__).parent
    
    # Check if we're in the right directory
    if not (gui_dir / 'app.py').exists():
        print("❌ Error: app.py not found in current directory")
        sys.exit(1)
    
    # Check for requirements
    try:
        import flask
        print("✓ Flask is installed")
    except ImportError:
        print("❌ Error: Flask is not installed")
        print("   Run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Change to gui directory
    os.chdir(gui_dir)
    
    print("\n📋 Starting the application...")
    print("   - Server: http://localhost:5001")
    print("   - Press Ctrl+C to stop\n")
    
    # Give user a moment to read the message
    time.sleep(1)
    
    try:
        # Try to open browser automatically
        print("🌐 Opening browser...")
        webbrowser.open('http://localhost:5001')
    except:
        print("ℹ️  Could not open browser automatically")
        print("   Please open: http://localhost:5001")
    
    # Run the Flask app
    print("\n🚀 Application starting...\n")
    os.system(f"{sys.executable} app.py")

if __name__ == '__main__':
    main()
