import { FC, Fragment } from "react";
import RbModal from "./components/modal/RubyModal";
import RefModal from "./components/modal/RefModal";

const Modals: FC = () => {
  return (
    <Fragment>
      <RbModal />
      <RefModal />
    </Fragment>
  );
};

export default Modals;
