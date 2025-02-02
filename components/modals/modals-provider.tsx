import React from "react";
import { CreateServerModal } from "./create-server-modal";
import { CreateChannelModal } from "./create-channel-modal";
import InvitePeopleModal from "./invite-people-modal";
import ManageMembersModal from "./manage-members-modal";
import { ServerSettingModal } from "./server-setting-modal";
import LeaveServerModal from "./leave-server-modal";
import DeleteServerModal from "./delete-server-modal";

export default function ModalsProvider() {
  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <InvitePeopleModal />
      <ManageMembersModal />
      <ServerSettingModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
}
