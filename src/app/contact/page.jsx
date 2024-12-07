"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import AddContacts from "@/components/Contacts/addContact";
import Dependents from "@/components/Contacts/dependantlist";
import Emergency from "@/components/Contacts/emergencylist";
export default function ContactBook() {
  return (
    <Provider store={store}>
      <div>
        <div className="relative top-20 m-3 px-1">
          <AddContacts />
        </div>
        <div className="m-3 mt-[6rem] p-1">
          <Emergency />
        </div>
        <div className="m-3 px-1">
          <Dependents />
        </div>
      </div>
    </Provider>
  );
}
