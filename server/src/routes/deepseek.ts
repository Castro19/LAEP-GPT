// import express, { Request, Response } from "express";
// import { deepseek } from "../index";
// import { PassThrough } from "stream";
// import { getLiveClass } from "../db/models/liveClasses/liveClassServices";

// const router = express.Router();

// router.post("/", async (req: Request, res: Response) => {
//   if (!res.headersSent) {
//     console.log("Setting headers");
//     res.removeHeader("Content-Length");
//     res.setHeader("Content-Type", "text/plain");
//     res.setHeader("Transfer-Encoding", "chunked");
//   }
//   try {
//     const { message, options } = req.body;

//     const response = await deepseek.chat.completions.create({
//       model: "deepseek-chat",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful assistant. Return every response in markdown format and make sure to format it nicely to be read by a human",
//         },
//         { role: "user", content: `${message}\noptions:${options}` },
//       ],
//       stream: true,
//     });

//     const passThrough = new PassThrough();
//     passThrough.pipe(res);

//     for await (const chunk of response) {
//       if (chunk.choices[0]?.delta.content) {
//         console.log(chunk.choices[0].delta);
//         const content = chunk.choices[0].delta.content || "";
//         passThrough.write(content);
//       }
//     }
//     passThrough.end();
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Testing route
// router.get("/liveClass", async (req, res) => {
//   const { courseId } = req.query;
//   if (!courseId) {
//     res.status(400).send("Course ID is required");
//     return;
//   }
//   const liveClass = await getLiveClass(courseId as string);
//   console.log(liveClass);
//   res.json(liveClass);
// });

// export default router;
