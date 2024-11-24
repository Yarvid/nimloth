FROM mcr.microsoft.com/devcontainers/universal:2-linux

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

RUN python -m pip install --upgrade pip \
&& curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
