"use client";

import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../redux/notificationSlice";

export default function NotificationsProvider({ children }) {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    notifications.forEach((notification) => {
      // Check if this notification is already displayed
      if (!Store.getNotification(notification.id)) {
        Store.addNotification({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
            pauseOnHover: true,
            showIcon: true,
          },
          onRemoval: () => dispatch(removeNotification(notification.id)),
        });
      }
    });
  }, [notifications, dispatch]);
  return (
    <>
      <ReactNotifications />
      {children}
    </>
  );
}
