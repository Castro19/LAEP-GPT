export default function chooseModel(modelType) {
  if (modelType == "normal") {
    return "Act as a helpful assistant that responds to the prompt in a structured format.";
  } else if (modelType == "matching") {
    return "Act as a matching AI, that can match my response to a specific advisor for a Senior Project. For every message please make a section 'Advisor Matching' that gives details on what type of advisor would be the best fit for my project and concepts.";
  } else if (modelType == "ethical") {
    return "Become an ethical AI chatbot and give valid concerns and questions on my response. For every message, please provide me with a section called `Ethical Concerns`, that gives me a list of valid concerns I should address and make note of regarding the senior project.";
  } else {
    return "Ignore this statement as model type was not found... ";
  }
}
