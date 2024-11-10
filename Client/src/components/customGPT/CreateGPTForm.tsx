import React, { useState } from "react";
// Redux:
import { useAppDispatch, useAppSelector, gptActions } from "@/redux";

// Import UI Components
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/register/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function GPTForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [instructions, setInstructions] = useState("");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [localError, setLocalError] = useState("");

  // Auth:
  // Redux
  const dispatch = useAppDispatch();
  const { isLoading, error, lastCreatedGpt } = useAppSelector(
    (state) => state.gpt
  );
  const userId = useAppSelector((state) => state.auth.userId);

  // UI Toast
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLocalError("");

    if (!title || !desc || !instructions) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (!userId) {
      setLocalError("Please be signed in to create an assistant");
      return;
    }

    if (!isLoading) {
      try {
        setLocalError(""); // Clear error on successful sign in
        await dispatch(
          gptActions.addGpt({
            userId,
            title,
            urlPhoto,
            desc,
            instructions,
            suggestedQuestions: [],
          })
        );

        setTitle("");
        setUrlPhoto("");
        setDesc("");
        setInstructions("");
        // Apply toast
        toast({
          title: "Custom Assistant Added",
          description: `Congratulations, your custom assistant was just created!`,
          action: (
            <ToastAction onClick={handleUndo} altText="Delete Schedule">
              Undo
            </ToastAction>
          ),
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUndo = async () => {
    if (lastCreatedGpt) {
      await dispatch(gptActions.deleteGpt({ id: lastCreatedGpt }));
    }
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
              maxLength={1000}
              onChange={(e) => setDesc(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              className="dark:bg-zinc-800"
              value={instructions}
              maxLength={5000}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </LabelInputContainer>
          {localError && <ErrorMessage text={localError} />}
          {error && <ErrorMessage text={error} />}
          <Button disabled={isLoading} className="">
            {isLoading ? "Creating..." : "Create GPT"}
          </Button>
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
