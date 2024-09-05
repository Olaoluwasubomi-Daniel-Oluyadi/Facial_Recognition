AWS Facial Recognition App

This project demonstrates building a facial recognition app using AWS services like Amazon Rekognition, Lambda, DynamoDB, API Gateway, and S3, with a React front-end. The registration flow indexes employee images uploaded to an S3 bucket using Rekognition, then stores the data in DynamoDB. In the authentication flow, a visitor uploads an image via the React app, which triggers a Lambda function to match the image against stored data.
