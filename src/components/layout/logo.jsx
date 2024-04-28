import { Link } from "react-router-dom";

// Local import
import * as styles from '~/src/styles/common.module.scss';
import logo from '~/src/assets/images/logo.png';
// ---------------------------------------------------
export default Logo = ({ height = 24, width = 24 }) => {
  return (
    <Link to="/" className={styles["header__logo-text"]}>
      <img src={logo} alt="logo" height={height} width={width} />
    </Link>)
}
