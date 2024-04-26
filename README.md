
# Data Driven Democracy

### About

Mapping India's 2024 Elections "Data-Driven Democracy" is a project designed to illuminate the complexities of India's electoral process through the lens of digital humanities, aligning closely with the DH goals of interdisciplinary research and innovative public scholarship. At the heart of this initiative is a collaboration between MIT's UROP students and Indian journalists, aimed at developing a dynamic website that presents real-time election data, opinion polls, and demographic analyses in an accessible, visual format.  

This project not only seeks to demystify the vast electoral landscape of the world's largest democracy but also to engage UROP students in the practical application of digital tools and methodologies in social sciences research. By integrating data visualization, statistical analysis, and digital mapping, students will gain hands-on experience in translating complex datasets into compelling, user-friendly narratives.  

"Data-Driven Democracy" embodies the DH mission by fostering a learning environment where technology meets humanities, encouraging students to explore the digital dimensions of civic engagement and political discourse. The project's collaborative framework offers a unique opportunity for students to contribute to meaningful research that bridges academic inquiry with real-world applications, enhancing public understanding of democratic processes and enriching the digital humanities community at MIT.
  

### Installation  

This project was created using Python 3.12 and Node LTS 20.12.2  

```
git clone https://github.com/dhmit/data-driven-democracy.git
cd data-driven-democracy  

# Make virtual environmnent
python -m venv venv

## Activate virtual environment ##
# Windows
venv/scripts/activate.bat
# Linux/Mac
source venv/bin/activate
  
# Install requirements (Run whenever requirements.txt or package-lock.json are updated)
pip install -r requirements.txt
npm ci

# Build database
cd backend
python manage.py update_db
```

### Run  
In the backend directory of the project
```
python manage.py launch_site
```