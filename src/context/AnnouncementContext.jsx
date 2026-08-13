import { createContext, useContext } from "react";

export const AnnouncementContext = createContext(null);

export function useAnnouncements() {
  return useContext(AnnouncementContext);
}