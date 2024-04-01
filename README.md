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

2. **Install client dependencies**

    ```
    cd Client
    npm install
    ```

3. **Install server dependencies**

    ```
    cd server
    npm install
    ```

4. **Get your Open AI API key from [Open AI API Key](https://platform.openai.com/account/api-keys)**

5. **Environment Variable Setup**

    - Go to the server folder and create a `.env` file in the root of the server folder and create a variable
      `REACT_APP_OPENAI_API_KEY = [Your Open AI key here]` inside the `.env` file.

## Usage

1. **Start the client**

    ```
    cd client
    npm start
    ```

2. **Start the server**

    ```
    cd server
    node index.js
    ```

## Next Steps

1. Continuously display the message as it finishes using the `stream: true` parameter on the server side API request.
2. Implement a header and footer.
3. Implement a main menu of options for different types of models to use.

## Contributors

To be updated.

## License

To be updated.
