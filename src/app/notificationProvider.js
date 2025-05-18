"use client";

import dynamic from "next/dynamic";

const ReactNotifications = dynamic(
  () =>
    import("react-notifications-component").then(
      (mod) => mod.ReactNotifications
    ),
  { ssr: false }
);

export default function NotificationsWrapper() {
  return <ReactNotifications />;
}
