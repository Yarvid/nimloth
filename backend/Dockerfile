# Use an official Python runtime as a parent image
FROM python:3.9-slim-bookworm

# Prevent Python from writing pyc files to disc (reduces container size)
ENV PYTHONDONTWRITEBYTECODE 1

# Prevent Python from buffering stdout and stderr (enables real-time log visibility)
ENV PYTHONUNBUFFERED 1


# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . /code/

# This will run whenever the container is launched
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
