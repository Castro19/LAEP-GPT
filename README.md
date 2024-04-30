# LAEP LLM

## Description

This project is a part of California Polytechnic State University (Cal Poly) in San Luis Obispo under the supervision of Prof. Franz J. Kurfess. It is an open-source repository intended to aid students in their senior project.

We are currently in the early stages of building an AI chatbot that will provide ethical considerations for senior projects, help match students with advisors for their projects, and utilize the power of AI to enhance the experience of a student's senior project.

<img src="https://live.staticflickr.com/65535/53625001307_7cc401a26b_b.jpg" width="700" alt="Description">

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Next Steps](#nextSteps)
- [Contributors](#contributors)
- [License](#license)

## Requirements

- Node JS
- npm
- [Create Open AI account](https://platform.openai.com/signup/)

## Installation

1. **Clone the repository**

   ```
   git clone https://github.com/Castro19/LAEP-GPT.git
   ```

2. **Install client & server dependencies**
   In the root directory `LAEP-GPT` enter the following:

   ```
   npm run install:all
   ```

3. **Install Dependencies for root directory**
   In the root directory `LAEP-GPT` enter the following:

   ```
   npm install
   ```

4. **Get your Open AI API key from [Open AI API Key](https://platform.openai.com/account/api-keys)**

5. **Environment Variable Setup**

   - Go to the server folder and create a `.env` file in the root of the server folder and create the variables:
     ```
     OPENAI_API_KEY=[Your Open AI key here]
     PORT=4000
     ```

## Usage

1. **Start the client and server**

   ```
   npm start
   ```

## Next Steps

1. Continuously display the message as it finishes using the `stream: true` parameter on the server side API request.
2. Implement authentication
3. Implement an open source LLM

## Contributors

Cristian Castro

## License

To be updated.
