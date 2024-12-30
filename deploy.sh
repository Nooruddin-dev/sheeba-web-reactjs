#!/bin/bash

# Variables
read -p "Enter SSH Username: " SERVER_USER
read -p "Enter Server IP Address: " SERVER_IP
read -s -p "Enter SSH Password: " PASSWORD
echo
SERVER_PATH="htdocs/src"
LOCAL_DIST_PATH="./build"  # Folder to be zipped

# Generate zip file name with date format
DATE_SUFFIX=$(date +"%d_%b_%y")
ZIP_FILE="fe_build_$DATE_SUFFIX.zip"

echo "Zipping contents of the folder..."
cd $LOCAL_DIST_PATH
zip -r ../$ZIP_FILE . -x "*.DS_Store" -x "__MACOSX*" 
cd ..

echo "Starting deployment..."

# Step 1: SSH to server and execute commands
sshpass -p "$PASSWORD" ssh -t $SERVER_USER@$SERVER_IP << EOF
  echo "Connected to server..."
  cd $SERVER_PATH
  echo "Deleting files"
  find . -mindepth 1 -delete
EOF

echo "Copying zip file to server..."
# Step 2: Copy zip file to server
sshpass -p "$PASSWORD" scp $ZIP_FILE $SERVER_USER@$SERVER_IP:$SERVER_PATH

# Step 3: SSH to extract, install dependencies, and restart the server
sshpass -p "$PASSWORD" ssh $SERVER_USER@$SERVER_IP << EOF
  cd $SERVER_PATH
  echo "Extracting zip file..."
  unzip $ZIP_FILE
EOF

echo "Cleaning up local zip file..."
rm $ZIP_FILE

echo "Deployment complete!"