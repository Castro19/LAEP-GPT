import { useEffect, useRef } from "react";
import ChatContainer from "@/components/chat/chatBody/ChatContainer";
import {
  useAppSelector,
  useAppDispatch,
  assistantActions,
  messageActions,
  calendarActions,
} from "@/redux";
import { useParams } from "react-router-dom";
import { fetchLogById } from "@/redux/log/crudLog";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPageLayout from "@/components/layout/ChatPage/ChatPageLayout";
import { LogData } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";
import OuterSidebar from "@/components/layout/OuterIconSidebar";
import useMobile from "@/hooks/use-mobile";

const ChatPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useMobile();
  const { chatId } = useParams();

  const userId = useAppSelector((state) => state.auth.userId);
  const { assistantList, currentModel } = useAppSelector(
    (state) => state.assistant
  );
  const { primaryCalendarId, currentCalendar } = useAppSelector(
    (state) => state.calendar
  );
  const hasFetchedassistantList = useRef(false);

  useEffect(() => {
    if (hasFetchedassistantList.current) return;
    hasFetchedassistantList.current = true;

    const fetchassistantList = async () => {
      if (userId) {
        try {
          dispatch(assistantActions.fetchAll());
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching GPT list: ", error);
          }
        }
      }
    };
    fetchassistantList();
  }, [assistantList.length, dispatch, userId]);

  useEffect(() => {
    if (assistantList.length > 0) {
      // Set the assistant to the assistant with our current chat ID
      if (currentModel.id !== "") {
        dispatch(assistantActions.setCurrentAssistant(currentModel.id));
      } else {
        dispatch(assistantActions.setCurrentAssistant(assistantList[0].id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantList, dispatch]);

  useEffect(() => {
    const fetchLog = async () => {
      if (chatId) {
        dispatch(messageActions.toggleNewChat(false));
        try {
          const log = (await fetchLogById(chatId)) as LogData;
          if (log.content) {
            dispatch(
              messageActions.setMsgList({
                chatId,
                content: log.content,
                assistantMongoId: log.assistantMongoId || "",
              })
            );
          }
          dispatch(messageActions.setCurrentChatId(chatId));
          if (log.assistantMongoId) {
            dispatch(
              assistantActions.setCurrentAssistant(log.assistantMongoId)
            );
          }
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching log: ", error);
          }
        }
      }
    };
    fetchLog();
  }, [chatId, dispatch]);

  useEffect(() => {
    const fetchCalendars = async () => {
      if (userId) {
        await dispatch(calendarActions.fetchCalendarsAsync());
      }
    };
    fetchCalendars();
    // Only run this effect once on component mount
  }, [dispatch, userId]);

  useEffect(() => {
    if (primaryCalendarId) {
      dispatch(calendarActions.getCalendarByIdAsync(primaryCalendarId));
    }
  }, [primaryCalendarId, dispatch]);

  if (environment === "dev") {
    console.log("CURRENT CALENDAR: ", currentCalendar);
  }
  return (
    <>
      <div className="flex">
        {isMobile ? null : <OuterSidebar />}
        <SidebarProvider className="dark:bg-slate-900">
          <ChatPageLayout>
            <ChatContainer />
          </ChatPageLayout>
        </SidebarProvider>
      </div>
    </>
  );
};

export default ChatPage;
