// Fake data (replace this with a real fetch)
import fakeFetch from "scripts/fakeFetch";

// Node modules
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Project files
import NavigationBarAdmin from "components/NavigationBarAdmin";
import InputField from "components/InputField";
import StatusError from "components/StatusError";
import StatusLoading from "components/StatusLoading";
import Fields from "data/fields-details-other.json";
import eStatus from "interfaces/eStatus";

export default function AdminDetailsOther() {
  // Global state
  const { code } = useParams();

  // Local state
  const [status, setStatus] = useState(eStatus.LOADING);
  const [data, setData] = useState("");

  // Properties
  const endPoint: string = "details-other/:id/";

  // Methods
  useEffect(() => {
    fakeFetch(endPoint, code)
      .then((response) => onSuccess(response.data))
      .catch((error) => onFailure(error));
  }, []);

  function onSuccess(data: string) {
    setData(data);
    setStatus(eStatus.READY);
  }

  function onFailure(error: string) {
    console.error(error);
    setStatus(eStatus.ERROR);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    fakeFetch(endPoint + "update/", data)
      .then((response) => alert(response.data))
      .catch(onFailure);
  }

  // Safeguards
  if (status === eStatus.LOADING) return <StatusLoading />;
  if (status === eStatus.ERROR) return <StatusError />;

  return (
    <div id="admin-detail-others" className="admin-pages">
      <NavigationBarAdmin />
      <header>
        <h1>Admin details</h1>
        <form onSubmit={(event) => onSubmit(event)}>
          <InputField field={Fields} state={[data, setData]} />
          <hr />
          <button>Save</button>
        </form>
      </header>
    </div>
  );
}
