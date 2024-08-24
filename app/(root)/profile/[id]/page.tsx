import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getUserIDByClerkId } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Plus } from "lucide-react";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { redirect } from "next/navigation";
import { SearchParamProps } from "@/app/types";
import EventLink from "@/components/shared/EventLink";
import { SignedIn } from "@clerk/nextjs";
import ProfilePageContent from "../ProfilePageContent";
import EventsOrganized from "../EventsOrganized";

const ProfilePage = async ({ params, searchParams }: SearchParamProps) => {
  const userId = params.id;
  const { sessionClaims } = auth();

  let isUser = false;

  if (sessionClaims?.userID) {
    const userActualId = sessionClaims.userId as string;
    isUser = userActualId === userId;
  }

  if (isUser) {
    redirect("/profile");
  }

  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const organizedEventsPromise = getEventsByUser({
    userId,
    page: 1,
  }).then((data) => data ?? { data: [], totalPages: 0 });

  return (
    <EventsOrganized
      organizedEventsPromise={organizedEventsPromise}
      eventsPage={eventsPage}
      isUser={isUser}
    />
  );
};

export default ProfilePage;
