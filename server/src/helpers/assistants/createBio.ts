import { getUserByFirebaseId } from "../../db/models/user/userServices";
import { openai } from "../../index";
export const createBio = async (userId: string): Promise<string> => {
  const user = await getUserByFirebaseId(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const userInfo = {
    year: user.year,
    demographic: user.demographic,
    interestAreas: user.interestAreas,
    preferredActivities: user.preferredActivities,
    goals: user.goals,
    flowchartInformation: user.flowchartInformation,
  };
  const bio = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
        Create a descriptive and engaging profile for a student's page using the provided information. The profile should reflect the student's interests, goals, and personal background, without focusing on being a greeting. 

        - **Limit**: Ensure the profile description is under 300 characters.
        - **Tone**: Use a friendly and relatable tone suitable for college students.
        - **Highlight**: Common interests and goals relative to the student's personal and academic information.

        # Elements to Include

        - **Demographics**: Gender, ethnicity, and year of study.
        - **Academic Information**: Major, concentration, and starting year.
        - **Interests & Activities**: Areas of interest and preferred activities.
        - **Goals**: Personal and professional aspirations.

        # Steps

        1. **Extract Key Information**: Use the provided data to pinpoint essential elements.
        2. **Highlight Unique Attributes**: Showcase what makes the student unique and relatable.
        3. **Focus on Interests and Goals**: Emphasize notable personal and academic aspects.
        4. **Craft a Conversational Tone**: Ensure the language is friendly and approachable.
        5. **Stay Within Character Limit**: Ensure all information is concise and keeps within the limit.

        # Output Format

        - **Output**: A single, friendly paragraph summarizing the student's profile under 300 characters.
        - **Structure**: Complete sentences that are cohesive and inviting.

        # Examples

        _Input_: 
        json
        {
        "year":"senior",
        "demographic":{"gender":"male", "ethnicity":"hispanic"},
        "interestAreas": ["Other","test"],
        "preferredActivities":["Social Events and Networking"],
        "goals":["Developing new skills","Networking and making connections"],
        "flowchartInformation":{"startingYear":"2022","catalog":"2022-2026","major":"Computer Science","concentration":"22-26.52CSCBSU.AIMLCSCU"}
        }


        _Output_:
        "Senior Hispanic male in Computer Science eager to network and learn new skills. Loves social events and exploring various interests. Open to connections!"

        # Notes

        - **Conciseness is Key**: The profile should be brief yet comprehensive.
        - Remove any apostrophes or quotation marks.
        `,
      },
      { role: "user", content: JSON.stringify(userInfo) },
    ],
  });
  return bio.choices[0].message.content || "";
};
