// Fake data
import fakeFetch from "scripts/fakeFetch";

// Node modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Project files
import EpisodeChooser from "components/EpisodeChooser";
import HeroDetails from "components/HeroDetails";
import StatusEmpty from "components/StatusEmpty";
import StatusError from "components/StatusError";
import StatusLoading from "components/StatusLoading";
import eStatus from "interfaces/eStatus";
import iContent from "interfaces/iContent";
import eContentType from "interfaces/eContentType";
import iDetailsOther from "interfaces/iDetailsOther";
import iDetailsSeries from "interfaces/iDetailsSeries";
import { useModal } from "state/ModalContext";

interface iProps {
  item: iContent;
}

export default function ModalDetails({ item }: iProps) {
  const { id, type_id, title, summary } = item;

  // Global state
  const navigate = useNavigate();
  const { setModal } = useModal();

  // Local state
  const [status, setStatus] = useState(eStatus.LOADING);
  const [dataOther, setDataOther] = useState({} as iDetailsOther);
  const [dataSerie, setDataSerie] = useState(Array<iDetailsSeries>);

  // Properties
  const isASeries: boolean = type_id === eContentType.SERIES;
  const emptyOther: boolean = Object(dataOther).length === 0;
  const emptySeries: boolean = dataSerie.length === 0;
  const endPoint = isASeries ? "details-series/:id/" : "details-other/:id/";
  const videoCode = isASeries ? dataSerie[0]?.video_code : dataOther.video_code;

  // Methods
  useEffect(() => {
    fakeFetch(endPoint, id)
      .then((response) => onSuccess(response.data))
      .catch((error) => onFailure(error));
  }, []);

  function onSuccess(data: any) {
    isASeries ? setDataSerie(data) : setDataOther(data);
    setStatus(eStatus.READY);
  }

  function onFailure(error: string) {
    console.error(error);
    setStatus(eStatus.ERROR);
  }

  function onClick(videoCode: string): void {
    navigate(`video/${videoCode}`);
    setModal(null);
  }

  // Safeguards
  if (status === eStatus.LOADING) return <StatusLoading />;
  if (status === eStatus.ERROR) return <StatusError />;
  if (emptyOther && emptySeries) return <StatusEmpty />;

  return (
    <div className="modal-details">
      <HeroDetails item={item} videoCode={videoCode} onClick={onClick} />
      <section className="description">
        <h2>{title}</h2>
        <p>{summary}</p>
      </section>
      {isASeries && <EpisodeChooser episodes={dataSerie} onClick={onClick} />}
    </div>
  );
}
