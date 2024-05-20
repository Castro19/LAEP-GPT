import React, { useEffect, useRef, useState } from "react";
// Redux:
import { useDispatch } from "react-redux";
import { addGpt, deleteGpt } from "@/redux/gpt/gptSlice.js";

// Importing component
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/register/ErrorMessage";
// Importing Contexts;
import { useAuth } from "@/contexts/authContext";
// Import UI Components
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function GPTForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [instructions, setInstructions] = useState("");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [gptError, setGptError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newGptSaved, setNewGptSaved] = useState<string | null>();
  const newGptSavedRef = useRef(newGptSaved);

  // Auth:
  const { userId } = useAuth();
  // Redux
  const dispatch = useDispatch();
  // UI Toast
  const { toast } = useToast();

  useEffect(() => {
    newGptSavedRef.current = newGptSaved;
  }, [newGptSaved]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setGptError("");

    if (!title || !desc || !instructions) {
      setGptError("Please fill in all fields.");
      return;
    }

    if (!isCreating) {
      try {
        setIsCreating(true);
        setGptError(""); // Clear error on successful sign in
        console.log("Title: ", title);
        console.log("Desc: ", desc);
        console.log("Instructions: ", instructions);
        const gptResponse = await dispatch(
          addGpt({ userId, title, urlPhoto, desc, instructions })
        );
        console.log("GPT Response: ", gptResponse);
        setNewGptSaved(gptResponse.payload.id);

        setTitle("");
        setUrlPhoto("");
        setDesc("");
        setInstructions("");
        // Apply toast
        toast({
          title: "Custom Assistant Added",
          description: `Congratulations, your custom assisstant was just created!`,
          action: (
            <ToastAction onClick={handleUndo} altText="Delete Schedule">
              Undo
            </ToastAction>
          ),
        });
        setIsCreating(false); // Update signing
      } catch (error) {
        console.error(error);
        setIsCreating(false); // Update signing in state upon error
        // For other errors, you may want to display a generic error message
        setGptError("Failed to create GPT. Please try again later.");
      }
    }
  };

  const handleUndo = async () => {
    console.log("Delete the newly created assistant: ", newGptSavedRef);
    await dispatch(deleteGpt({ id: newGptSavedRef.current }));
  };

  return (
    <div>
      <div className="max-w w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-gray-700">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Create an Assistant!
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="title">Url Photo (Optional) </Label>
            <Input
              id="title"
              placeholder="Insert the url for the photo"
              value={urlPhoto}
              onChange={(e) => setUrlPhoto(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="description"
              className="dark:bg-zinc-800"
              value={desc}
              maxLength={500}
              onChange={(e) => setDesc(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              className="dark:bg-zinc-800"
              value={instructions}
              maxLength={2500}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </LabelInputContainer>
          {gptError ? <ErrorMessage text={gptError} /> : <></>}
          <Button className="">Create GPT</Button>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
