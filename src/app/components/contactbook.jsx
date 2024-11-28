import AddContacts from "./contactbooks/addContact";
import Dependents from "./contactbooks/dependantlist";
import Emergency from "./contactbooks/emergencylist";
export default function ContactBook() {
  return (
    <div>
      <div className="m-3">
        <AddContacts />
      </div>
      <div className="m-3">
        <Emergency />
      </div>
      <div className="m-3">
        <Dependents />
      </div>
    </div>
  );
}
