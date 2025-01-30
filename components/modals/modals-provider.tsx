import React from "react";
import { CreateServerModal } from "./create-server-modal";
import InvitePeopleModal from "./invite-people-modal";

export function ModalsProvider() {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
    </>
  );
}
