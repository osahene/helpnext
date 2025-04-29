"use client";

import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../redux/notificationSlice";

export default function NotificationsProvider({ children }) {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const displayedNotifications = useRef(new Set());

  useEffect(() => {
    notifications.forEach((notification) => {
      // Check if this notification is already displayed
      if (!displayedNotifications.current.has(notification.id)) {
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
          onRemoval: (id) => {
            dispatch(removeNotification(id));
            displayedNotifications.current.delete(id);
          },
        });
        displayedNotifications.current.add(notification.id);
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
