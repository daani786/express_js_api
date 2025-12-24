FROM node:20-alpine


# Set the working directory to /app
WORKDIR /express-app

# Copy package.json and package-lock.json (if available) to the working directory
COPY --from=app_folder ./package*.json .

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY --from=app_folder . .

# Expose the port the app runs on (e.g., 3000, 8080)
EXPOSE 8000

# Define the command to run the application
CMD ["npm", "start"]


# ENTRYPOINT ["tail"]
# CMD ["-f", "/dev/null"]