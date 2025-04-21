"use client";

import { ReactNotifications } from "react-notifications-component";
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
      Store.addNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isMobile: true,
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
        onRemoval: () => {
          dispatch(removeNotification(notification.id));
        },
      });
    });
  }, [notifications, dispatch]);
  return (
    <>
      <ReactNotifications />
      {children}
    </>
  );
}
